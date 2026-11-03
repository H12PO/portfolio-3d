// ============================================================
//  FRACTALES : les programmes de la carte graphique (GLSL ES 3.0)
//  Deux passes. 1) Un shader de calcul écrit, pour chaque pixel,
//  des données brutes dans une texture flottante : nombre
//  d'itérations lissé, relief, distance au bord. 2) Le shader de
//  couleur les traduit avec la palette. Changer de palette ne
//  demande donc aucun nouveau calcul.
//  Le pixel (gl_FragCoord) devient un point du plan : centre + décalage × pas.
// ============================================================

const ENTETE = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
`

// Commun aux shaders de calcul : où est le pixel dans le plan
const PIXEL = `
uniform vec2 u_taille;   // taille de l'image entière, en pixels
uniform vec2 u_decal;    // coin de ce morceau dans l'image (export par tuiles)
uniform vec4 u_centre;   // x fort, x faible, y fort, y faible
uniform float u_pas;     // taille d'un pixel dans le plan
uniform vec2 u_rotation; // (cos θ, sin θ) : la vue peut tourner
uniform int u_iter;
out vec4 sortie;

// Décalage du pixel par rapport au centre, dans le plan (y vers le haut, comme gl_FragCoord).
// u_decal sert aussi à décaler les points de calcul d'une fraction de pixel (anticrénelage).
vec2 decalage() {
  vec2 d = (gl_FragCoord.xy + u_decal - 0.5 * u_taille) * u_pas;
  return vec2(d.x * u_rotation.x - d.y * u_rotation.y, d.x * u_rotation.y + d.y * u_rotation.x);
}

vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 cdiv(vec2 a, vec2 b) { return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / dot(b, b); }
`

/* ---------- Mandelbrot, Julia, Burning Ship, Tricorn, Multibrot ---------- */

export const EVASION = `${ENTETE}${PIXEL}
uniform float u_sens;     // +1, ou −1 quand l'axe imaginaire est retourné (Burning Ship)
uniform int u_formule;    // 0 Mandelbrot, 1 Burning Ship, 2 Tricorn, 3 Multibrot
uniform bool u_julia;     // ensemble de Julia : z₀ = le point, c fixé
uniform vec2 u_c;
uniform float u_degre;
uniform vec2 u_lumiere;   // direction de la lumière du relief

#ifdef PERTURBATION
// L'orbite de référence Z₀, Z₁… calculée par le processeur, rangée 2048 par ligne.
// Deux orbites : A part du centre de la vue, B part de 0 (pour Mandelbrot, A = B).
uniform sampler2D u_orbite;
uniform int u_debutA;
uniform int u_longA;
uniform int u_debutB;
uniform int u_longB;
vec2 reference(int i) { return texelFetch(u_orbite, ivec2(i & 2047, i >> 11), 0).xy; }

// |c + d| − |c|, sans perdre la petite différence d (Burning Ship)
float diffabs(float c, float d) {
  float s = c + d;
  if (c >= 0.0) return s >= 0.0 ? d : -2.0 * c - d;
  return s > 0.0 ? 2.0 * c + d : -d;
}
#endif

const float R2 = 1e6;           // rayon d'évasion² : grand, pour une coloration lissée sans marches
const float LOG_ECHELLE = 69.0775527898; // ln(1e30)

vec2 cpuiss(vec2 z, float d) {
  float r = length(z);
  if (r == 0.0) return vec2(0.0);
  float t = atan(z.y, z.x) * d;
  return pow(r, d) * vec2(cos(t), sin(t));
}

void main() {
  vec2 off = decalage();
  vec2 dz = vec2(u_julia ? 1.0 : 0.0, 0.0); // dérivée : dz/dc (Mandelbrot) ou dz/dz₀ (Julia)
  float ajout = u_julia ? 0.0 : 1.0;
  float echelle = 0.0;                       // la dérivée grandit vite : on la garde divisée par 1e30^echelle
  bool sorti = false;
  int n = 0;
  vec2 zf;

#ifdef PERTURBATION
  // Chaque pixel ne suit que son écart δ à l'orbite de référence : z = Z + δ.
  // δ reste petit, des nombres de 32 bits suffisent même à un zoom de 10¹².
  vec2 ecart = vec2(off.x, off.y * u_sens);
  vec2 dc = u_julia ? vec2(0.0) : ecart;  // écart du paramètre c
  vec2 dl = u_julia ? ecart : vec2(0.0); // écart du point z
  float k = u_formule == 2 ? -2.0 : 2.0;
  int debut = u_debutA;
  int lon = u_longA;
  int m = 0;
  vec2 Z = reference(debut);
  vec2 z = Z + dl;
  for (int i = 0; i < u_iter; i++) {
    if (u_formule == 0) dz = 2.0 * cmul(z, dz) + vec2(ajout, 0.0);
    // δ ← f(Z + δ) − f(Z), développé pour ne jamais soustraire deux grands nombres voisins
    float xy = Z.x * dl.y + dl.x * (Z.y + dl.y);                     // xy − XY
    float re = (2.0 * Z.x + dl.x) * dl.x - (2.0 * Z.y + dl.y) * dl.y; // (x² − y²) − (X² − Y²)
    float im = u_formule == 1 ? 2.0 * diffabs(Z.x * Z.y, xy) : k * xy;
    dl = vec2(re, im) + dc;
    m++;
    Z = reference(debut + m);
    z = Z + dl;
    if (dot(z, z) > R2) { sorti = true; n = i; break; }
    // Changement de référence (Zhuoran, 2021) : quand z passe plus près de 0 que de Z,
    // ou quand l'orbite de référence s'arrête, on repart de l'orbite B au rang 0
    if (dot(z, z) < dot(dl, dl) || m >= lon - 1) {
      dl = z;
      m = 0;
      debut = u_debutB;
      lon = u_longB;
      Z = vec2(0.0);
    }
  }
  zf = z;
#else
  vec2 p = vec2(u_centre.x + off.x, (u_centre.z + off.y) * u_sens);
  vec2 z = u_julia ? p : vec2(0.0);
  vec2 c = u_julia ? u_c : p;
  for (int i = 0; i < u_iter; i++) {
    if (u_formule == 0) dz = 2.0 * cmul(z, dz) + vec2(ajout, 0.0);
    else if (u_formule == 3) dz = u_degre * cmul(cpuiss(z, u_degre - 1.0), dz) + vec2(ajout, 0.0);
    if (u_formule == 1) z = abs(z);
    if (u_formule == 3) z = cpuiss(z, u_degre) + c;
    else z = vec2(z.x * z.x - z.y * z.y, (u_formule == 2 ? -2.0 : 2.0) * z.x * z.y) + c;
    if (dot(dz, dz) > 1e60) { dz *= 1e-30; echelle += 1.0; }
    if (dot(z, z) > R2) { sorti = true; n = i; break; }
  }
  zf = z;
#endif

  // Ne s'échappe pas (dans la limite des itérations) : intérieur
  if (!sorti) { sortie = vec4(-1.0, 1.0, 1e4, 1.0); return; }

  float lz = 0.5 * log(dot(zf, zf)); // ln|z|
  float d = u_formule == 3 ? u_degre : 2.0;
  float nu = float(n) + 2.0 - log(lz) / log(d); // nombre d'itérations lissé

  float relief = 1.0;
  float dist = 1e4;
  if (u_formule == 0 || u_formule == 3) {
    // Relief : la direction de z / z' sert de normale à une surface éclairée
    vec2 u = normalize(cdiv(zf, dz));
    relief = max(0.0, (dot(u, u_lumiere) + 1.5) / 2.5);
    // Distance au bord : |z| ln|z| / (2 |z'|), en pixels
    float ld = log(0.5 * exp(lz) * lz) - log(length(dz)) - echelle * LOG_ECHELLE - log(u_pas);
    dist = exp(clamp(ld, -30.0, 30.0));
  }
  sortie = vec4(nu, relief, dist, 1.0);
}
`

/* ---------- Méthode de Newton ---------- */

export const NEWTON = `${ENTETE}${PIXEL}
uniform vec2 u_coef[6];    // coefficients du polynôme, du degré 0 au plus haut
uniform int u_degreP;
uniform vec2 u_racines[5];
uniform int u_nRacines;
uniform vec2 u_relax;      // z ← z − a · f(z) / f'(z)

void main() {
  vec2 off = decalage();
  vec2 z = vec2(u_centre.x + off.x, u_centre.z + off.y);
  int racine = -1;
  int n = 0;
  for (int i = 0; i < u_iter; i++) {
    vec2 f = vec2(0.0);
    vec2 d = vec2(0.0);
    for (int k = 5; k >= 0; k--) {
      if (k > u_degreP) continue;
      d = cmul(d, z) + f;
      f = cmul(f, z) + u_coef[k];
    }
    if (dot(d, d) < 1e-30) break;
    z -= cmul(u_relax, cdiv(f, d));
    n = i;
    for (int k = 0; k < 5; k++) {
      if (k >= u_nRacines) break;
      vec2 e = z - u_racines[k];
      if (dot(e, e) < 1e-6) racine = k;
    }
    if (racine >= 0) break;
  }
  sortie = vec4(racine >= 0 ? float(n) : -1.0, float(racine), 0.0, 1.0);
}
`

/* ---------- Fractale de Lyapunov ---------- */

export const LYAPUNOV = `${ENTETE}${PIXEL}
uniform int u_suite[24];   // 0 = A, 1 = B
uniform int u_long;

void main() {
  vec2 off = decalage();
  float a = u_centre.x + off.x;
  float b = u_centre.z + off.y;
  float x = 0.5;
  float s = 0.0;
  int k = 0;
  for (int i = 0; i < 50 + u_iter; i++) {
    float r = u_suite[k] == 1 ? b : a;
    if (i >= 50) s += log(abs(r * (1.0 - 2.0 * x)) + 1e-12);
    x = r * x * (1.0 - x);
    k++;
    if (k >= u_long) k = 0;
  }
  float l = s / float(u_iter);
  sortie = vec4(l, 0.0, 0.0, 1.0);
}
`

/* ---------- Couleur : des données à l'image ---------- */

export const COULEUR = `${ENTETE}
uniform sampler2D u_donnees;
uniform sampler2D u_palette;
uniform vec4 u_cadre;      // zone de destination : x, y, largeur, hauteur (pixels)
uniform vec2 u_zone;       // part de la texture de données réellement remplie (aperçu en basse résolution)
uniform int u_echelle;     // 0 linéaire, 1 logarithmique, 2 adaptée au zoom (comme Inigo Quilez)
uniform float u_norme;     // 1 + log2(zoom) : les bandes s'écartent à mesure qu'on zoome
uniform bool u_bandes;     // nombre d'étapes entier : des bandes nettes au lieu d'un dégradé
uniform int u_type;        // 0 évasion, 1 Newton, 2 Lyapunov
uniform float u_densite;   // tours de palette par itération
uniform float u_decalage;
uniform float u_relief;
uniform bool u_bords;
uniform vec3 u_interieur;
uniform float u_nRacines;
out vec4 sortie;

vec3 palette(float t) { return texture(u_palette, vec2(fract(t), 0.5)).rgb; }

void main() {
  vec2 uv = (gl_FragCoord.xy - u_cadre.xy) / u_cadre.zw * u_zone;
  vec4 d = texture(u_donnees, uv);
  vec3 c = u_interieur;
  if (u_type == 0) {
    if (d.x < 0.0) c = u_interieur;
    else {
      // Logarithmique : un tour de palette par doublement du nombre d'itérations.
      // Adaptée au zoom : la densité est divisée par 1 + log2(zoom), comme dans les shaders d'Inigo Quilez.
      float nu = u_bandes ? floor(d.x) : d.x;
      float t = u_echelle == 1 ? log2(max(nu, 0.0) + 1.0) * u_densite * 16.0
              : u_echelle == 2 ? nu * u_densite / u_norme
              : nu * u_densite;
      c = palette(t + u_decalage);
      c *= mix(1.0, d.y, u_relief);
      if (u_bords) c = mix(u_interieur, c, smoothstep(0.1, 1.0, d.z));
    }
  } else if (u_type == 1) {
    if (d.x < 0.0) c = u_interieur;
    else c = palette(d.y / u_nRacines + u_decalage) * (0.3 + 0.7 * exp(-d.x * u_densite * 2.0));
  } else if (u_type == 2) {
    if (d.x < 0.0) c = palette(0.5 + u_decalage + min(0.45, -d.x * u_densite * 10.0));
    else c = u_interieur;
  }
  sortie = vec4(c, 1.0);
}
`

/* ---------- Copie d'une image (agrandie avec lissage si la texture est lisse) ---------- */

export const COPIE = `${ENTETE}
uniform sampler2D u_image;
uniform vec4 u_cadre;
uniform vec2 u_zone;
out vec4 sortie;

void main() {
  vec2 uv = (gl_FragCoord.xy - u_cadre.xy) / u_cadre.zw * u_zone;
  // ne jamais lire au-delà de la zone remplie, même avec le lissage
  vec2 demi = 0.5 / vec2(textureSize(u_image, 0));
  uv = clamp(uv, demi, u_zone - demi);
  sortie = vec4(texture(u_image, uv).rgb, 1.0);
}
`
