// ============================================================
//  ÉPICYCLES DE FOURIER : le moteur (pur, sans dessin, testable en Node)
//
//  Une courbe fermée du plan est vue comme une fonction périodique à
//  valeurs complexes, z(t) = x(t) + i y(t), t ∈ [0, 1). On la mesure en
//  N points régulièrement espacés (dans le temps de sa formule, ou à
//  vitesse constante le long de son tracé), puis la transformée de
//  Fourier rapide donne ses coefficients :
//
//      c_k = (1/N) Σ_n z_n e^{−2iπ k n / N},   k = −N/2 … N/2 − 1
//
//  et z(t) ≈ Σ_k c_k e^{2iπ k t} : une chaîne de vecteurs qui tournent,
//  le k-ième de rayon |c_k|, k tours par période. Ce sont les épicycles.
// ============================================================

export const N_DEFAUT = 2048

/* ---------- Transformée de Fourier rapide (Cooley-Tukey, base 2) ---------- */

/**
 * FFT en place sur (re, im), de longueur une puissance de 2.
 * Sens direct : X_k = Σ x_n e^{−2iπkn/N} (sans division) ; inverse : e^{+2iπkn/N}.
 */
export function fft(re, im, inverse = false) {
  const N = re.length
  if (N & (N - 1)) throw new Error('fft : N doit être une puissance de 2')
  // permutation par inversion des bits
  for (let i = 1, j = 0; i < N; i++) {
    let bit = N >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t
      t = im[i]; im[i] = im[j]; im[j] = t
    }
  }
  // papillons : des blocs de 2, puis 4, 8… jusqu'à N
  const signe = inverse ? 1 : -1
  for (let taille = 2; taille <= N; taille <<= 1) {
    const demi = taille >> 1
    const a = (signe * 2 * Math.PI) / taille
    const wr = Math.cos(a), wi = Math.sin(a)
    for (let debut = 0; debut < N; debut += taille) {
      let cr = 1, ci = 0
      for (let k = 0; k < demi; k++) {
        const p = debut + k, q = p + demi
        const tr = re[q] * cr - im[q] * ci
        const ti = re[q] * ci + im[q] * cr
        re[q] = re[p] - tr; im[q] = im[p] - ti
        re[p] += tr; im[p] += ti
        const ncr = cr * wr - ci * wi
        ci = cr * wi + ci * wr
        cr = ncr
      }
    }
  }
}

/** Transformée discrète directe, en O(N²) : la référence pour vérifier la FFT */
export function tfdNaive(re, im) {
  const N = re.length
  const R = new Float64Array(N), I = new Float64Array(N)
  for (let k = 0; k < N; k++) {
    let sr = 0, si = 0
    for (let n = 0; n < N; n++) {
      const a = (-2 * Math.PI * k * n) / N
      sr += re[n] * Math.cos(a) - im[n] * Math.sin(a)
      si += re[n] * Math.sin(a) + im[n] * Math.cos(a)
    }
    R[k] = sr; I[k] = si
  }
  return [R, I]
}

/* ---------- Échantillonnage d'une courbe ---------- */

/** Longueur d'une ligne brisée [[x, y], …] (fermée : avec le retour au début) */
export function longueur(points, fermee = true) {
  let L = 0
  const n = points.length
  for (let i = 1; i < n; i++) L += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  if (fermee && n > 1) L += Math.hypot(points[0][0] - points[n - 1][0], points[0][1] - points[n - 1][1])
  return L
}

/**
 * N points à intervalles réguliers le long d'une ligne brisée (abscisse curviligne).
 * Fermée : le dernier segment ramène au premier point. Ouverte : on va du premier au
 * dernier point, et la fonction périodique saute de la fin au début (d'où le phénomène de Gibbs).
 */
export function reechantillonner(points, N = N_DEFAUT, fermee = true) {
  const pts = fermee ? [...points, points[0]] : points.slice()
  const cumul = [0]
  for (let i = 1; i < pts.length; i++) cumul.push(cumul[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cumul[cumul.length - 1] || 1
  const x = new Float64Array(N), y = new Float64Array(N)
  let seg = 1
  for (let n = 0; n < N; n++) {
    // fermée : N points sur [0, L) ; ouverte : N points de 0 à L compris, la fin rejoignant le début à la période suivante
    const s = fermee ? (n / N) * L : (n / (N - 1)) * L
    while (seg < pts.length - 1 && cumul[seg] < s) seg++
    const l = cumul[seg] - cumul[seg - 1]
    const u = l > 0 ? (s - cumul[seg - 1]) / l : 0
    x[n] = pts[seg - 1][0] + u * (pts[seg][0] - pts[seg - 1][0])
    y[n] = pts[seg - 1][1] + u * (pts[seg][1] - pts[seg - 1][1])
  }
  return { x, y }
}

/** N points d'une courbe donnée par une formule f(t) → [x, y], t ∈ [0, 1) */
export function echantillonnerFormule(f, N = N_DEFAUT) {
  const x = new Float64Array(N), y = new Float64Array(N)
  for (let n = 0; n < N; n++) { const [a, b] = f(n / N); x[n] = a; y[n] = b }
  return { x, y }
}

/** Les points d'une formule, assez serrés pour en faire une ligne brisée */
export function pointsDeFormule(f, n = 4096) {
  return Array.from({ length: n }, (_, k) => f(k / n))
}

/* ---------- Coefficients ---------- */

/**
 * Les coefficients de Fourier des échantillons (x, y), avec c_k = (1/N) Σ z_n e^{−2iπkn/N}.
 * Renvoie { N, re, im, amp } rangés par indice de tableau ; la fréquence de l'indice j est
 * frequence(j, N) ∈ [−N/2, N/2).
 */
export function coefficients({ x, y }) {
  const N = x.length
  const re = Float64Array.from(x), im = Float64Array.from(y)
  fft(re, im)
  const amp = new Float64Array(N)
  for (let j = 0; j < N; j++) { re[j] /= N; im[j] /= N; amp[j] = Math.hypot(re[j], im[j]) }
  return { N, re, im, amp }
}

export const frequence = (j, N) => (j < N / 2 ? j : j - N)
export const indice = (k, N) => ((k % N) + N) % N

/**
 * L'ordre dans lequel on ajoute les cercles (le centre, k = 0, n'en est pas un) :
 *   'frequence' : k = 1, −1, 2, −2, 3… (les sommes partielles de Fourier)
 *   'amplitude' : du plus grand cercle au plus petit (la compression)
 * Renvoie la liste des indices de tableau.
 */
export function ordre(c, mode) {
  const { N, amp } = c
  const l = []
  if (mode === 'amplitude') {
    for (let j = 1; j < N; j++) l.push(j)
    l.sort((a, b) => amp[b] - amp[a] || Math.abs(frequence(a, N)) - Math.abs(frequence(b, N)))
  } else {
    for (let k = 1; k < N / 2; k++) { l.push(indice(k, N)); l.push(indice(-k, N)) }
    l.push(N / 2)
  }
  return l
}

/** Fréquence la plus haute (en valeur absolue) parmi les M premiers cercles */
export function frequenceMax(c, liste, M) {
  let K = 0
  for (let q = 0; q < M; q++) K = Math.max(K, Math.abs(frequence(liste[q], c.N)))
  return K
}

/**
 * Poids d'un coefficient de fréquence k dans une somme de fréquence maximale K :
 *   'aucun'   : 1 (la somme partielle de Fourier)
 *   'fejer'   : 1 − |k|/(K + 1) (moyenne de Cesàro des sommes partielles)
 *   'lanczos' : sinc(k/(K + 1)) (les facteurs σ de Lanczos)
 */
export function poids(k, K, lissage) {
  if (lissage === 'fejer') return Math.max(0, 1 - Math.abs(k) / (K + 1))
  if (lissage === 'lanczos') {
    if (k === 0) return 1
    const u = (Math.PI * k) / (K + 1)
    return Math.sin(u) / u
  }
  return 1
}

/**
 * Une approximation : les M premiers cercles de la liste, pondérés.
 * Renvoie les cercles { k, r, phase, re, im } (le centre en premier, k = 0), rangés du plus
 * grand au plus petit (pour dessiner la chaîne), et la courbe complète échantillonnée en N
 * points (transformée inverse).
 */
export function approximation(c, liste, M, lissage = 'aucun') {
  const { N } = c
  M = Math.max(0, Math.min(M, liste.length))
  const K = frequenceMax(c, liste, M)
  const re = new Float64Array(N), im = new Float64Array(N)
  re[0] = c.re[0]; im[0] = c.im[0]
  const cercles = []
  for (let q = 0; q < M; q++) {
    const j = liste[q]
    const k = frequence(j, N)
    const w = poids(k, K, lissage)
    re[j] = c.re[j] * w; im[j] = c.im[j] * w
    cercles.push({ k, re: re[j], im: im[j], r: Math.hypot(re[j], im[j]) })
  }
  cercles.sort((a, b) => b.r - a.r)
  // la courbe : z(t_n) = Σ c_k e^{2iπkn/N}, une FFT inverse (sans division : les c_k sont déjà divisés)
  const x = Float64Array.from(re), y = Float64Array.from(im)
  fft(x, y, true)
  return { centre: [c.re[0], c.im[0]], cercles, courbe: { x, y }, K, M }
}

/** La chaîne des centres à l'instant t ∈ [0, 1) : [x0, y0, x1, y1, …], le dernier point est la pointe */
export function chaine(approx, t, sortie = null) {
  const n = approx.cercles.length
  const out = sortie && sortie.length >= 2 * (n + 1) ? sortie : new Float64Array(2 * (n + 1))
  let x = approx.centre[0], y = approx.centre[1]
  out[0] = x; out[1] = y
  for (let q = 0; q < n; q++) {
    const { k, re, im } = approx.cercles[q]
    const a = 2 * Math.PI * k * t
    const ca = Math.cos(a), sa = Math.sin(a)
    x += re * ca - im * sa
    y += re * sa + im * ca
    out[2 * q + 2] = x; out[2 * q + 3] = y
  }
  return out
}

/* ---------- Énergie, erreur ---------- */

/**
 * Énergie de la forme autour de son centre : Σ_{k≠0} |c_k|² = (1/N) Σ |z_n − c_0|² (Parseval).
 */
export function energie(c) {
  let s = 0
  for (let j = 1; j < c.N; j++) s += c.amp[j] * c.amp[j]
  return s
}

/** Part de l'énergie portée par les M premiers cercles, et erreur relative (écart quadratique) */
export function bilan(c, liste, M) {
  const E = energie(c) || 1
  let s = 0
  for (let q = 0; q < Math.min(M, liste.length); q++) s += c.amp[liste[q]] ** 2
  const part = Math.min(1, s / E)
  return { energie: part, erreur: Math.sqrt(Math.max(0, 1 - part)) }
}

/** Erreur relative selon le nombre de cercles, pour des valeurs de M données */
export function courbeErreur(c, liste, valeurs) {
  const E = energie(c) || 1
  const cumul = new Float64Array(liste.length + 1)
  for (let q = 0; q < liste.length; q++) cumul[q + 1] = cumul[q] + c.amp[liste[q]] ** 2
  return valeurs.map((M) => [M, Math.sqrt(Math.max(0, 1 - cumul[Math.min(M, liste.length)] / E))])
}

/** Le plus petit nombre de cercles qui garde une part p de l'énergie */
export function cerclesPour(c, liste, p) {
  const E = energie(c) || 1
  let s = 0
  for (let q = 0; q < liste.length; q++) {
    s += c.amp[liste[q]] ** 2
    if (s >= p * E) return q + 1
  }
  return liste.length
}

/** Nombre de coefficients non nuls (au-dessus d'un seuil relatif au plus grand) */
export function cerclesNonNuls(c, seuil = 1e-9) {
  let max = 0
  for (let j = 1; j < c.N; j++) max = Math.max(max, c.amp[j])
  let n = 0
  for (let j = 1; j < c.N; j++) if (c.amp[j] > seuil * max) n++
  return n
}

/* ---------- Décroissance des coefficients ---------- */

/**
 * Amplitude typique des coefficients par octave de fréquence : pour |k| entre 2^m et 2^(m+1),
 * la racine de la moyenne de |c_k|² (les deux signes de k). Renvoie [[k moyen, amplitude], …].
 */
export function decroissance(c, kMax = c.N / 4) {
  const res = []
  for (let a = 1; a * 2 <= kMax; a *= 2) {
    let s = 0, n = 0
    for (let k = a; k < 2 * a; k++) {
      s += c.amp[indice(k, c.N)] ** 2 + c.amp[indice(-k, c.N)] ** 2
      n += 2
    }
    res.push([Math.sqrt(a * (2 * a - 1)), Math.sqrt(s / n)])
  }
  return res
}

/** Pente d'une droite des moindres carrés en coordonnées log-log */
export function pente(points) {
  const P = points.filter(([a, b]) => a > 0 && b > 0).map(([a, b]) => [Math.log(a), Math.log(b)])
  const n = P.length
  if (n < 2) return 0
  const mx = P.reduce((s, p) => s + p[0], 0) / n, my = P.reduce((s, p) => s + p[1], 0) / n
  let num = 0, den = 0
  for (const [a, b] of P) { num += (a - mx) * (b - my); den += (a - mx) ** 2 }
  return num / den
}

/* ---------- Descripteurs de Fourier : reconnaître une forme ---------- */

/**
 * Une signature de la forme, qui ne change ni quand on la déplace, ni quand on l'agrandit,
 * ni quand on la tourne, ni quand on change le point de départ : les |c_k| pour
 * k = −K…K (sauf 0), divisés par la racine de l'énergie. Le sens de parcours change k en −k ;
 * on compare donc aussi la signature retournée.
 */
export function descripteur(c, K = 12) {
  const E = Math.sqrt(energie(c)) || 1
  const d = []
  for (let k = -K; k <= K; k++) if (k) d.push(c.amp[indice(k, c.N)] / E)
  return d
}

export function distanceDescripteurs(a, b) {
  const n = a.length
  let s1 = 0, s2 = 0
  for (let i = 0; i < n; i++) {
    s1 += (a[i] - b[i]) ** 2
    s2 += (a[i] - b[n - 1 - i]) ** 2      // l'autre sens de parcours
  }
  return Math.sqrt(Math.min(s1, s2))
}

/* ---------- Une forme prête à animer ---------- */

/**
 * Prépare une forme : ses échantillons, ses coefficients et ses deux ordres.
 * @param forme { points, fermee } ou { formule }
 * @param parametrage 'formule' (le temps de la formule) ou 'vitesse' (vitesse constante)
 */
export function preparer(forme, parametrage = 'vitesse', N = N_DEFAUT) {
  let ech
  if (forme.formule && parametrage === 'formule') ech = echantillonnerFormule(forme.formule, N)
  else {
    const pts = forme.points ?? pointsDeFormule(forme.formule)
    ech = reechantillonner(pts, N, forme.fermee !== false)
  }
  const c = coefficients(ech)
  return { echantillons: ech, c, ordres: { frequence: ordre(c, 'frequence'), amplitude: ordre(c, 'amplitude') } }
}

/** Cadre commun : centre et demi-côté d'un carré qui contient la forme */
export function cadre({ x, y }) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (let n = 0; n < x.length; n++) {
    x0 = Math.min(x0, x[n]); x1 = Math.max(x1, x[n]); y0 = Math.min(y0, y[n]); y1 = Math.max(y1, y[n])
  }
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, r: Math.max(x1 - x0, y1 - y0) / 2 || 1 }
}
