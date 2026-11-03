// ============================================================
//  LENIA : les programmes de la carte graphique (GLSL ES 3.0)
//  Tout le calcul passe par la transformée de Fourier rapide (FFT) :
//  une convolution par un noyau de rayon R coûterait (2R + 1)² lectures
//  par case ; dans l'espace de Fourier, c'est une simple multiplication.
//  Une texture RGBA porte deux nombres complexes : (x, y) et (z, w).
//  Les états vivent dans des textures flottantes de 32 bits, monde torique.
// ============================================================

const ENTETE = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
out vec4 sortie;
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
`

/* ---------- FFT : une étape de Stockham le long d'un axe ---------- */
// Aucune permutation des indices n'est nécessaire : l'ordre naturel est
// conservé d'une étape à l'autre (vérifié contre une DFT directe).
export const FFT = `${ENTETE}
uniform sampler2D u_entree;
uniform int u_N;          // taille du monde (puissance de 2)
uniform int u_etape;      // 0 … log2(N) − 1
uniform bool u_vertical;
uniform float u_signe;    // −1 : transformée directe ; +1 : inverse (non normalisée)

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  int k = u_vertical ? p.y : p.x;
  int sous = 2 << u_etape;        // taille des sous-transformées : 2^(étape + 1)
  int demi = sous >> 1;
  int pair = (k / sous) * demi + (k & (demi - 1));
  int impair = pair + (u_N >> 1);
  vec4 a = texelFetch(u_entree, u_vertical ? ivec2(p.x, pair) : ivec2(pair, p.y), 0);
  vec4 b = texelFetch(u_entree, u_vertical ? ivec2(p.x, impair) : ivec2(impair, p.y), 0);
  float angle = u_signe * 6.283185307179586 * float(k & (sous - 1)) / float(sous);
  vec2 w = vec2(cos(angle), sin(angle));
  sortie = vec4(a.xy + cmul(w, b.xy), a.zw + cmul(w, b.zw));
}
`

/* ---------- Mise en complexes : deux canaux réels par texture ---------- */
export const COMPLEXES = `${ENTETE}
uniform sampler2D u_etat;
uniform ivec2 u_canaux;   // canaux placés en (x, y) et en (z, w) ; −1 = rien

float canal(vec4 a, int c) { return c == 0 ? a.r : c == 1 ? a.g : c == 2 ? a.b : 0.0; }

void main() {
  vec4 a = texelFetch(u_etat, ivec2(gl_FragCoord.xy), 0);
  sortie = vec4(canal(a, u_canaux.x), 0.0, canal(a, u_canaux.y), 0.0);
}
`

/* ---------- Produit par deux noyaux, dans l'espace de Fourier ---------- */
export const PRODUIT = `${ENTETE}
uniform sampler2D u_spectre0;   // canaux 0 (xy) et 1 (zw)
uniform sampler2D u_spectre1;   // canal 2 (xy)
uniform sampler2D u_noyaux;     // noyau a (xy), noyau b (zw)
uniform ivec2 u_source;         // canal source de chaque noyau

vec2 spectre(vec4 s0, vec4 s1, int c) { return c == 0 ? s0.xy : c == 1 ? s0.zw : s1.xy; }

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 s0 = texelFetch(u_spectre0, p, 0);
  vec4 s1 = texelFetch(u_spectre1, p, 0);
  vec4 k = texelFetch(u_noyaux, p, 0);
  sortie = vec4(cmul(spectre(s0, s1, u_source.x), k.xy), cmul(spectre(s0, s1, u_source.y), k.zw));
}
`

// Fonctions de croissance, communes à plusieurs shaders (convention de Bert Chan)
const CROISSANCE = `
float croissance(float u, float m, float s, int type) {
  float d = u - m;
  if (type == 1) return pow(max(0.0, 1.0 - d * d / (9.0 * s * s)), 4.0) * 2.0 - 1.0;
  if (type == 2) return exp(-d * d / (2.0 * s * s)) * 2.0 - 1.0;
  return abs(d) <= s ? 1.0 : -1.0;
}
`

/* ---------- Accumulation de la croissance de deux noyaux ---------- */
// Lenia classique et étendu : cumul[c] += h · G(K * A). Flow Lenia : les poids h
// sont lus dans des textures de paramètres (espèces différentes, case par case).
export const CUMUL = `${ENTETE}${CROISSANCE}
uniform sampler2D u_cumul;
uniform sampler2D u_potentiel;  // sortie de la FFT inverse : U_a en x, U_b en z
uniform float u_norme;          // 1 / N² : la FFT inverse n'est pas normalisée
uniform int u_nb;               // 1 ou 2 noyaux dans ce passage
uniform vec2 u_m;
uniform vec2 u_s;
uniform vec2 u_h;
uniform ivec2 u_cible;          // canal qui reçoit chaque croissance
uniform int u_type;             // type de croissance (1, 2, 3)
uniform bool u_poidsLocaux;     // Flow Lenia à plusieurs espèces : h lu dans u_poids
uniform sampler2D u_poids;      // 4 poids par case
uniform ivec2 u_rang;           // rang des deux poids dans la texture (0…3)

void ajouter(inout vec4 c, int canal, float v) {
  if (canal == 0) c.r += v;
  else if (canal == 1) c.g += v;
  else c.b += v;
}

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 c = texelFetch(u_cumul, p, 0);
  vec4 u = texelFetch(u_potentiel, p, 0) * u_norme;
  vec2 h = u_h;
  if (u_poidsLocaux) {
    vec4 w = texelFetch(u_poids, p, 0);
    h = vec2(w[u_rang.x], w[u_rang.y]);
  }
  ajouter(c, u_cible.x, h.x * croissance(u.x, u_m.x, u_s.x, u_type));
  if (u_nb == 2) ajouter(c, u_cible.y, h.y * croissance(u.z, u_m.y, u_s.y, u_type));
  sortie = c;
}
`

/* ---------- Lenia : A ← clip(A + dt · cumul / Σh, 0, 1) ---------- */
export const MISE_A_JOUR = `${ENTETE}
uniform sampler2D u_etat;
uniform sampler2D u_cumul;
uniform float u_dt;
uniform vec3 u_sommeH;          // somme des poids reçus par chaque canal (0 = canal inactif)

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 a = texelFetch(u_etat, p, 0);
  vec4 c = texelFetch(u_cumul, p, 0);
  vec3 d = vec3(
    u_sommeH.x > 0.0 ? c.r / u_sommeH.x : 0.0,
    u_sommeH.y > 0.0 ? c.g / u_sommeH.y : 0.0,
    u_sommeH.z > 0.0 ? c.b / u_sommeH.z : 0.0);
  sortie = vec4(clamp(a.rgb + u_dt * d, 0.0, 1.0), 1.0);
}
`

/* ---------- SmoothLife : f ← s(n, m), ou un petit pas vers s ---------- */
// u_mode 0 : temps discret, f ← s. De 1 à 4 : temps continu, de pas u_dt
// (1 : f + dt(2s − 1), 2 : f + dt(s − f), 3 : m + dt(2s − 1), 4 : m + dt(s − m)).
export const SMOOTH = `${ENTETE}
uniform sampler2D u_etat;
uniform sampler2D u_potentiel;  // m (disque) en x, n (anneau) en z
uniform float u_norme;
uniform int u_mode;
uniform float u_dt;
uniform float u_b1;
uniform float u_b2;
uniform float u_d1;
uniform float u_d2;
uniform float u_an;
uniform float u_am;

float s1(float x, float a, float al) { return 1.0 / (1.0 + exp(-(x - a) * 4.0 / al)); }
float s2(float x, float a, float b, float al) { return s1(x, a, al) * (1.0 - s1(x, b, al)); }
float sm(float x, float y, float m, float al) { return x * (1.0 - s1(m, 0.5, al)) + y * s1(m, 0.5, al); }

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 u = texelFetch(u_potentiel, p, 0) * u_norme;
  float m = u.x;
  float n = u.z;
  float s = s2(n, sm(u_b1, u_d1, m, u_am), sm(u_b2, u_d2, m, u_am), u_an);
  float f = texelFetch(u_etat, p, 0).r;
  float base = u_mode >= 3 ? m : f;
  float g = s;
  if (u_mode == 1 || u_mode == 3) g = base + u_dt * (2.0 * s - 1.0);
  else if (u_mode == 2 || u_mode == 4) g = base + u_dt * (s - base);
  sortie = vec4(clamp(g, 0.0, 1.0), 0.0, 0.0, 1.0);
}
`

/* ---------- Flow Lenia 1 : le flux ---------- */
// F = ∇U (1 − α) − ∇A α, avec α = min(1, (A/θ)²) : la matière remonte l'affinité U,
// mais fuit les endroits trop pleins. On écrit le déplacement de chaque case.
export const FLUX = `${ENTETE}
uniform sampler2D u_etat;
uniform sampler2D u_cumul;      // affinité U en r
uniform int u_N;
uniform float u_dt;
uniform float u_theta;
uniform float u_max;            // déplacement maximal (fenêtre de redistribution − σ)

float lireU(ivec2 q) { return texelFetch(u_cumul, (q + u_N) % u_N, 0).r; }
float lireA(ivec2 q) { return texelFetch(u_etat, (q + u_N) % u_N, 0).r; }

// Sobel non normalisé, comme dans l'article
vec2 sobelU(ivec2 p) {
  float gx = 0.0;
  float gy = 0.0;
  for (int j = -1; j <= 1; j++) {
    float w = j == 0 ? 2.0 : 1.0;
    gx += w * (lireU(p + ivec2(1, j)) - lireU(p + ivec2(-1, j)));
    gy += w * (lireU(p + ivec2(j, 1)) - lireU(p + ivec2(j, -1)));
  }
  return vec2(gx, gy);
}
vec2 sobelA(ivec2 p) {
  float gx = 0.0;
  float gy = 0.0;
  for (int j = -1; j <= 1; j++) {
    float w = j == 0 ? 2.0 : 1.0;
    gx += w * (lireA(p + ivec2(1, j)) - lireA(p + ivec2(-1, j)));
    gy += w * (lireA(p + ivec2(j, 1)) - lireA(p + ivec2(j, -1)));
  }
  return vec2(gx, gy);
}

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  float a = lireA(p);
  float al = clamp((a / u_theta) * (a / u_theta), 0.0, 1.0);
  vec2 f = sobelU(p) * (1.0 - al) - sobelA(p) * al;
  sortie = vec4(clamp(u_dt * f, -u_max, u_max), 0.0, 1.0);
}
`

/* ---------- Flow Lenia 2 : la redistribution (reintegration tracking) ---------- */
// Chaque case envoie sa matière dans un carré de côté 2σ centré sur sa position
// d'arrivée ; une case reçoit la part de ce carré qui la recouvre. La masse totale
// est conservée exactement (aux arrondis près). Pour les espèces, la case prend les
// poids d'une des cases qui la nourrissent, tirée au sort selon la masse apportée.
export const REDISTRIBUTION = `${ENTETE}
uniform sampler2D u_etat;
uniform sampler2D u_flux;
uniform sampler2D u_poids;      // poids à transporter (mode « poids »)
uniform int u_N;
uniform float u_sigma;
uniform int u_portee;           // fenêtre : (2 portée + 1)² cases
uniform bool u_modePoids;       // false : écrit la masse ; true : écrit les poids choisis
uniform float u_graine;

float hasard(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + u_graine) * 43758.5453); }

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  float masse = 0.0;
  float total = 0.0;
  vec4 poids = vec4(0.0);
  float tirage = hasard(vec2(p));
  // premier passage : masse reçue ; le tirage parcourt les sources dans le même ordre
  for (int j = -u_portee; j <= u_portee; j++) {
    for (int i = -u_portee; i <= u_portee; i++) {
      ivec2 q = (p + ivec2(i, j) + u_N) % u_N;
      float a = texelFetch(u_etat, q, 0).r;
      if (a <= 0.0) continue;
      vec2 d = texelFetch(u_flux, q, 0).xy + vec2(i, j);   // arrivée de la source, relative à p
      vec2 l = clamp(0.5 - abs(d) + u_sigma, 0.0, min(1.0, 2.0 * u_sigma));
      masse += a * l.x * l.y / (4.0 * u_sigma * u_sigma);
    }
  }
  if (!u_modePoids) {
    sortie = vec4(masse, 0.0, 0.0, 1.0);
    return;
  }
  float seuil = tirage * masse;
  for (int j = -u_portee; j <= u_portee; j++) {
    for (int i = -u_portee; i <= u_portee; i++) {
      ivec2 q = (p + ivec2(i, j) + u_N) % u_N;
      float a = texelFetch(u_etat, q, 0).r;
      if (a <= 0.0) continue;
      vec2 d = texelFetch(u_flux, q, 0).xy + vec2(i, j);
      vec2 l = clamp(0.5 - abs(d) + u_sigma, 0.0, min(1.0, 2.0 * u_sigma));
      float w = a * l.x * l.y / (4.0 * u_sigma * u_sigma);
      if (w <= 0.0) continue;
      total += w;
      poids = texelFetch(u_poids, q, 0);
      if (total >= seuil) {
        sortie = poids;
        return;
      }
    }
  }
  sortie = masse > 0.0 ? poids : vec4(0.0);
}
`

/* ---------- Poser une créature : maximum avec ce qui est déjà là (monde torique) ---------- */
export const POSER = `${ENTETE}
uniform sampler2D u_etat;
uniform sampler2D u_motif;
uniform ivec2 u_coin;           // coin bas gauche du motif dans le monde
uniform ivec2 u_taille;
uniform int u_N;
uniform bool u_modePoids;       // Flow Lenia : écrit les poids de l'espèce là où le motif a de la matière
uniform vec4 u_valeur;

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 e = texelFetch(u_etat, p, 0);
  ivec2 l = (p - u_coin + 4 * u_N) % u_N;
  if (l.x >= u_taille.x || l.y >= u_taille.y) {
    sortie = e;
    return;
  }
  vec4 m = texelFetch(u_motif, l, 0);
  if (u_modePoids) sortie = m.r > 0.02 ? u_valeur : e;
  else sortie = vec4(max(e.rgb, m.rgb), 1.0);
}
`

/* ---------- Réduction : sommes par blocs de 4 × 4 (masse, centre de masse) ---------- */
export const REDUCTION = `${ENTETE}
uniform sampler2D u_entree;
uniform ivec2 u_taille;         // taille de l'entrée

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy) * 4;
  vec4 s = vec4(0.0);
  for (int j = 0; j < 4; j++)
    for (int i = 0; i < 4; i++) {
      ivec2 q = p + ivec2(i, j);
      if (q.x < u_taille.x && q.y < u_taille.y) s += texelFetch(u_entree, q, 0);
    }
  sortie = s;
}
`

/* ---------- Couleur : l'état du monde vers une image ---------- */
export const COULEUR = `${ENTETE}${CROISSANCE}
uniform sampler2D u_etat;
uniform sampler2D u_potentiel;  // pour les vues « potentiel » et « croissance » (Lenia classique)
uniform sampler2D u_poids;      // Flow Lenia : couleur des espèces
uniform sampler2D u_palette;
uniform int u_vue;              // 0 état, 1 potentiel, 2 croissance
uniform int u_rendu;            // 0 palette (1 canal), 1 RVB (canaux), 2 masse (Flow), 3 espèces (Flow)
uniform float u_norme;
uniform float u_m;
uniform float u_s;
uniform int u_type;
uniform float u_gainU;          // le potentiel est petit : on l'étire pour le voir

vec3 palette(float t) { return texture(u_palette, vec2(clamp(t, 0.0, 1.0) * 0.996 + 0.002, 0.5)).rgb; }

void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  vec4 a = texelFetch(u_etat, p, 0);
  vec3 c;
  if (u_vue == 1) {
    float u = texelFetch(u_potentiel, p, 0).x * u_norme;
    c = palette(u * u_gainU);
  } else if (u_vue == 2) {
    float u = texelFetch(u_potentiel, p, 0).x * u_norme;
    float g = croissance(u, u_m, u_s, u_type);
    // vert : la matière pousse ; magenta : elle disparaît
    c = g > 0.0 ? vec3(0.1, 0.85, 0.45) * g : vec3(0.85, 0.2, 0.6) * (-g) * 0.6;
  } else if (u_rendu == 1) {
    c = pow(a.rgb, vec3(0.8));
  } else if (u_rendu == 2) {
    c = palette(1.0 - exp(-a.r * 1.6));
  } else if (u_rendu == 3) {
    vec4 w = texelFetch(u_poids, p, 0);
    vec3 teinte = normalize(vec3(w.r + 0.6 * w.a, w.g + 0.3 * w.a, w.b) + 0.05);
    c = teinte * (1.0 - exp(-a.r * 2.0)) * 1.4;
  } else {
    c = palette(a.r);
  }
  sortie = vec4(c, 1.0);
}
`

/* ---------- Affichage : l'image du monde dans le canvas (lissée, monde torique) ---------- */
export const AFFICHAGE = `${ENTETE}
uniform sampler2D u_image;
uniform vec4 u_cadre;           // x, y, largeur, hauteur du monde à l'écran, en pixels
uniform vec3 u_fond;

void main() {
  vec2 uv = (gl_FragCoord.xy - u_cadre.xy) / u_cadre.zw;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) {
    sortie = vec4(u_fond, 1.0);
    return;
  }
  sortie = vec4(texture(u_image, uv).rgb, 1.0);
}
`
