// ============================================================
//  HASHLIFE (Gosper, 1984)
//  L'univers est un arbre de quadrants : un nœud de niveau k est un
//  carré de 2^k × 2^k cases, fait de quatre nœuds de niveau k − 1.
//  Deux carrés identiques, où qu'ils soient et à n'importe quelle
//  génération, sont le même nœud (tableau de hachage). Et l'avenir
//  d'un nœud, une fois calculé, est mémorisé : un motif régulier
//  (canon, vaisseau…) se calcule une fois, puis se réutilise.
//
//  Le centre d'un nœud de niveau k ne dépend, pendant 2^(k−2)
//  générations, que du nœud lui-même (rien ne va plus vite que la
//  lumière, une case par génération) : on peut donc sauter de 2^(k−2)
//  générations d'un coup, récursivement.
//
//  Plan infini, règles à deux états (B/S). Aucune dépendance au DOM.
// ============================================================

// Au-delà de cette taille, on abandonne : un motif chaotique ne profite pas de la mémoïsation
export const LIMITE_NOEUDS = 2_000_000

export function creerHashlife(regle, { limite = LIMITE_NOEUDS } = {}) {
  const naitre = regle.naissance
  const rester = regle.survie

  // Nœuds : { id, k, nw, ne, sw, se, pop, suite: [pas → nœud] }
  // Table de hachage à clés numériques (bien plus rapide que des chaînes) ;
  // en cas de collision, la case contient une liste et on compare les enfants.
  const table = new Map()
  let taille = 0
  let prochainId = 2
  const MORT = { id: 0, k: 0, pop: 0 }
  const VIE = { id: 1, k: 0, pop: 1 }
  const vides = [MORT]

  const meme = (n, nw, ne, sw, se) => n.nw === nw && n.ne === ne && n.sw === sw && n.se === se

  function noeud(nw, ne, sw, se) {
    const cle = (Math.imul(nw.id, 0x9E3779B1) ^ Math.imul(ne.id, 0x85EBCA77) ^ Math.imul(sw.id, 0xC2B2AE3D) ^ Math.imul(se.id, 0x27D4EB2F)) >>> 0
    const trouve = table.get(cle)
    if (trouve) {
      if (!Array.isArray(trouve)) { if (meme(trouve, nw, ne, sw, se)) return trouve }
      else for (const n of trouve) if (meme(n, nw, ne, sw, se)) return n
    }
    if (taille >= limite) throw new Error('hashlife:limite')
    const n = { id: prochainId++, k: nw.k + 1, nw, ne, sw, se, pop: nw.pop + ne.pop + sw.pop + se.pop, suite: null }
    if (!trouve) table.set(cle, n)
    else if (Array.isArray(trouve)) trouve.push(n)
    else table.set(cle, [trouve, n])
    taille++
    return n
  }

  function vide(k) {
    while (vides.length <= k) {
      const v = vides[vides.length - 1]
      vides.push(noeud(v, v, v, v))
    }
    return vides[k]
  }

  // Nœuds centrés, à cheval sur deux ou quatre nœuds voisins (niveau k − 1)
  const horizontal = (w, e) => noeud(w.ne, e.nw, w.se, e.sw)
  const vertical = (n, s) => noeud(n.sw, n.se, s.nw, s.ne)
  const centre = (n) => noeud(n.nw.se, n.ne.sw, n.sw.ne, n.se.nw)

  // Cas de base : un carré de 4 × 4 → son centre 2 × 2 une génération plus tard
  function base(n) {
    const c = []
    for (const q of [n.nw, n.ne, n.sw, n.se]) c.push(q.nw.pop, q.ne.pop, q.sw.pop, q.se.pop)
    // c[] est rangé par quadrant ; on le remet en grille 4 × 4 : g[y][x]
    const g = [
      [c[0], c[1], c[4], c[5]],
      [c[2], c[3], c[6], c[7]],
      [c[8], c[9], c[12], c[13]],
      [c[10], c[11], c[14], c[15]],
    ]
    const cellule = (x, y) => {
      let s = 0
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) s += g[y + dy][x + dx]
      return (g[y][x] ? rester[s] : naitre[s]) ? VIE : MORT
    }
    return noeud(cellule(1, 1), cellule(2, 1), cellule(1, 2), cellule(2, 2))
  }

  /**
   * Avance le centre d'un nœud de niveau k ≥ 2 de 2^j générations (j ≤ k − 2).
   * Renvoie un nœud de niveau k − 1. Mémorisé par nœud et par j.
   */
  function suivant(n, j) {
    if (n.pop === 0) return vide(n.k - 1)
    if (!n.suite) n.suite = []
    const deja = n.suite[j]
    if (deja) return deja
    let r
    if (n.k === 2) {
      r = base(n)
    } else {
      // Neuf nœuds de niveau k − 1 qui se chevauchent
      const n00 = n.nw
      const n01 = horizontal(n.nw, n.ne)
      const n02 = n.ne
      const n10 = vertical(n.nw, n.sw)
      const n11 = centre(n)
      const n12 = vertical(n.ne, n.se)
      const n20 = n.sw
      const n21 = horizontal(n.sw, n.se)
      const n22 = n.se
      const plein = j === n.k - 2 // saut maximal : les deux moitiés avancent
      const a = (x) => (plein ? suivant(x, j - 1) : centre(x))
      const b = (x) => suivant(x, plein ? j - 1 : j)
      // Première moitié : neuf résultats de niveau k − 2
      const r00 = a(n00); const r01 = a(n01); const r02 = a(n02)
      const r10 = a(n10); const r11 = a(n11); const r12 = a(n12)
      const r20 = a(n20); const r21 = a(n21); const r22 = a(n22)
      // Seconde moitié : quatre nœuds de niveau k − 1, avancés à leur tour
      r = noeud(
        b(noeud(r00, r01, r10, r11)),
        b(noeud(r01, r02, r11, r12)),
        b(noeud(r10, r11, r20, r21)),
        b(noeud(r11, r12, r21, r22)),
      )
    }
    n.suite[j] = r
    return r
  }

  // Agrandit un nœud de niveau k en niveau k + 1, centré, entouré de vide
  function agrandir(n) {
    const v = vide(n.k - 1)
    return noeud(
      noeud(v, v, v, n.nw),
      noeud(v, v, n.ne, v),
      noeud(v, n.sw, v, v),
      noeud(n.se, v, v, v),
    )
  }

  // Le motif occupe-t-il seulement le carré central (la moitié du nœud) ?
  const centreSeul = (n) => n.nw.nw.pop + n.nw.ne.pop + n.nw.sw.pop
    + n.ne.nw.pop + n.ne.ne.pop + n.ne.se.pop
    + n.sw.nw.pop + n.sw.sw.pop + n.sw.se.pop
    + n.se.ne.pop + n.se.sw.pop + n.se.se.pop === 0

  /* ---------- L'univers : une racine et la position de son coin ---------- */

  const univers = { racine: vide(3), x: -4, y: -4, gen: 0 }

  // Pose une cellule vivante en (x, y) (coordonnées absolues), en agrandissant si besoin
  function poser(x, y) {
    let { racine } = univers
    while (true) {
      const taille = 2 ** racine.k
      if (x >= univers.x && y >= univers.y && x < univers.x + taille && y < univers.y + taille) break
      racine = agrandir(racine)
      univers.x -= taille / 2
      univers.y -= taille / 2
    }
    const ecrireDans = (n, px, py) => {
      if (n.k === 0) return VIE
      const moitie = 2 ** (n.k - 1)
      const ouest = px < moitie
      const nord = py < moitie
      const qx = ouest ? px : px - moitie
      const qy = nord ? py : py - moitie
      return noeud(
        nord && ouest ? ecrireDans(n.nw, qx, qy) : n.nw,
        nord && !ouest ? ecrireDans(n.ne, qx, qy) : n.ne,
        !nord && ouest ? ecrireDans(n.sw, qx, qy) : n.sw,
        !nord && !ouest ? ecrireDans(n.se, qx, qy) : n.se,
      )
    }
    univers.racine = ecrireDans(racine, x - univers.x, y - univers.y)
  }

  /**
   * Avance l'univers de 2^j générations d'un coup.
   */
  function sauter(j) {
    let n = univers.racine
    // Assez de marge pour ne rien perdre : le saut (2^j) doit rester ≤ 1/8 de la taille du nœud,
    // et le motif doit tenir dans le quart central (il s'étend d'au plus 2^j cases de chaque côté)
    while (n.k < j + 3 || !centreSeul(n) || !centreSeul(centre(n))) {
      const taille = 2 ** n.k
      n = agrandir(n)
      univers.x -= taille / 2
      univers.y -= taille / 2
    }
    const r = suivant(n, j)
    univers.x += 2 ** (n.k - 2)
    univers.y += 2 ** (n.k - 2)
    univers.racine = r
    univers.gen += 2 ** j
    return univers
  }

  // Avance de n générations quelconques, en sautant par puissances de 2
  function avancerDe(n) {
    let reste = n
    let j = 0
    while (reste > 0) {
      if (reste % 2) sauter(j)
      reste = Math.floor(reste / 2)
      j++
    }
  }

  // Liste des cellules vivantes (coordonnées absolues), éventuellement limitée à un rectangle
  function cellules(limite = 1e6) {
    const res = []
    const parcourir = (n, x, y) => {
      if (n.pop === 0 || res.length >= limite) return
      if (n.k === 0) { res.push([x, y]); return }
      const m = 2 ** (n.k - 1)
      parcourir(n.nw, x, y)
      parcourir(n.ne, x + m, y)
      parcourir(n.sw, x, y + m)
      parcourir(n.se, x + m, y + m)
    }
    parcourir(univers.racine, univers.x, univers.y)
    return res
  }

  // Boîte englobante des cellules vivantes (null si l'univers est vide)
  function boite() {
    if (univers.racine.pop === 0) return null
    let x0 = Infinity
    let y0 = Infinity
    let x1 = -Infinity
    let y1 = -Infinity
    const parcourir = (n, x, y) => {
      if (n.pop === 0) return
      const t = 2 ** n.k
      // inutile de descendre si le nœud ne peut pas agrandir la boîte
      if (x >= x0 && y >= y0 && x + t - 1 <= x1 && y + t - 1 <= y1) return
      if (n.k === 0) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
        return
      }
      const m = t / 2
      parcourir(n.nw, x, y)
      parcourir(n.ne, x + m, y)
      parcourir(n.sw, x, y + m)
      parcourir(n.se, x + m, y + m)
    }
    parcourir(univers.racine, univers.x, univers.y)
    return { x0, y0, x1, y1 }
  }

  /**
   * Densité de cellules vivantes par blocs de 2^niveau cases, dans une fenêtre :
   * appelle f(x, y, densite) pour chaque bloc non vide (coordonnées en blocs).
   * Sert au dessin quand on dézoome très loin.
   */
  function blocs(niveau, fenetre, f) {
    const parcourir = (n, x, y) => {
      if (n.pop === 0) return
      const t = 2 ** n.k
      if (x + t <= fenetre.x0 || y + t <= fenetre.y0 || x > fenetre.x1 || y > fenetre.y1) return
      if (n.k <= niveau) { f(Math.floor(x / 2 ** niveau), Math.floor(y / 2 ** niveau), n.pop / (t * t)); return }
      const m = t / 2
      parcourir(n.nw, x, y)
      parcourir(n.ne, x + m, y)
      parcourir(n.sw, x, y + m)
      parcourir(n.se, x + m, y + m)
    }
    parcourir(univers.racine, univers.x, univers.y)
  }

  return {
    univers,
    poser,
    sauter,
    avancerDe,
    cellules,
    boite,
    blocs,
    population: () => univers.racine.pop,
    noeuds: () => taille,
  }
}
