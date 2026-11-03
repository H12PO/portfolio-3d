import { creerMonde, avancer, mesurer, imageDe, paverSentiers, JOUR } from './moteur.js'
import { TERRAINS, scenario } from './scenarios.js'

// ============================================================
//  LIGNES DE DÉSIR : les images des fiches (onglet Comprendre) et de
//  quelques figures, calculées à l'avance dans Node.js avec le moteur
//  de l'explorateur, puis rangées dans fiches-images.js.
//  Une image = le sol (type de chaque case), l'usure (ou les deux
//  phéromones) sur 4 bits par case, et quelques marcheurs, compressés
//  (deflate, comme un fichier .zip), plus les portes et les arbres.
//  La page les décompresse (DecompressionStream) et les dessine aussitôt.
// ============================================================

// Pour chaque fiche : ses images. s : scénario ; r : réglages changés ; jours : durée ;
// paver : jour où l'on pave les sentiers ; heure : moment de la journée de la capture
export const IMAGES = {
  square: { images: [{ s: 'square', jours: 1, etiquette: 'j1' }, { s: 'square', jours: 6, etiquette: 'j6' }] },
  campus: { images: [{ s: 'campus', jours: 6, etiquette: 'avant' }, { s: 'campus', jours: 10, paver: 6, etiquette: 'apres' }] },
  trois: {
    images: [{ s: 'trois', jours: 10, r: { attrait: 0 }, etiquette: 'a0' }, { s: 'trois', jours: 10, r: { attrait: 3 }, etiquette: 'a3' }, { s: 'trois', jours: 10, r: { attrait: 10 }, etiquette: 'a10' }],
  },
  quatre: { images: [{ s: 'quatre', jours: 10, r: { attrait: 0 }, etiquette: 'a0' }, { s: 'quatre', jours: 10, r: { attrait: 3 }, etiquette: 'a3' }, { s: 'quatre', jours: 10, r: { attrait: 8 }, etiquette: 'a8' }] },
  anneau: { images: [{ s: 'anneau', jours: 1, etiquette: 'j1' }, { s: 'anneau', jours: 10, etiquette: 'j10' }] },
  repousse: { images: [{ s: 'repousse', jours: 8, r: { repousse: 8 }, etiquette: 'lente' }, { s: 'repousse', jours: 8, etiquette: 'rapide' }] },
  types: { images: [{ s: 'types', jours: 6, vue: 'types', etiquette: 'types' }] },
  pointe: { images: [{ s: 'pointe', jours: 5.18, etiquette: 'matin' }, { s: 'pointe', jours: 5.5, etiquette: 'midi' }, { s: 'pointe', jours: 5.82, etiquette: 'soir' }] },
  aeroport: { images: [{ s: 'aeroport', jours: 5, etiquette: 'hall' }] },
  effort: { images: [{ s: 'campus', jours: 8, etiquette: 'helbing' }, { s: 'effort', jours: 8, etiquette: 'effort' }] },
  pont: { images: [{ s: 'pont', jours: 3, graine: 1, etiquette: 'essai1' }, { s: 'pont', jours: 3, graine: 2, etiquette: 'essai2' }] },
  pontInegal: { images: [{ s: 'pontInegal', jours: 0.4, etiquette: 'debut' }, { s: 'pontInegal', jours: 3, etiquette: 'fin' }] },
  fourragement: { images: [{ s: 'fourragement', jours: 0.5, etiquette: 'debut' }, { s: 'fourragement', jours: 4, etiquette: 'fin' }] },
}

/** Calcule le monde d'une image de fiche (dans Node.js) */
export function calculerImage(img) {
  const s = scenario(img.s)
  const m = creerMonde(TERRAINS[s.terrain](), { ...s.r, ...(img.r ?? {}) }, img.graine ?? 11)
  const total = Math.round(img.jours * JOUR)
  if (img.paver) {
    avancer(m, Math.round(img.paver * JOUR))
    paverSentiers(m)
    avancer(m, total - Math.round(img.paver * JOUR))
  } else avancer(m, total)
  return m
}

/* ---------- Codage compact ---------- */

async function decompresser(texte) {
  const brut = atob(texte)
  const o = new Uint8Array(brut.length)
  for (let k = 0; k < brut.length; k++) o[k] = brut.charCodeAt(k)
  const flux = new Blob([o]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(flux).arrayBuffer())
}

/**
 * Code le monde m pour une fiche.
 * @param compresser (octets) → texte base64 des octets compressés (zlib dans Node)
 */
export function coder(m, compresser, maxAgents = 250) {
  const img = imageDe(m)
  const n = m.W * m.H
  const fourmis = m.p.modele === 'fourmis'
  // usure sur 4 bits ; fourmis : les deux phéromones dans un octet (nid en haut, nourriture en bas)
  const champ = new Uint8Array(n)
  for (let k = 0; k < n; k++) {
    champ[k] = fourmis ? ((img.champ[k] >> 4) << 4) | (img.champ2[k] >> 4) : img.champ[k] >> 4
  }
  const na = Math.min(img.na, maxAgents)
  const agents = new Uint8Array(na * 5)
  for (let i = 0; i < na; i++) {
    const x = Math.round((img.agents[4 * i] / m.h) * 64), y = Math.round((img.agents[4 * i + 1] / m.h) * 64)
    agents[5 * i] = x & 255; agents[5 * i + 1] = x >> 8
    agents[5 * i + 2] = y & 255; agents[5 * i + 3] = y >> 8
    agents[5 * i + 4] = img.agents[4 * i + 2]
  }
  const me = mesurer(m)
  return {
    W: m.W, H: m.H, h: m.h, fond: m.t.fond, modele: m.p.modele,
    portes: img.portes.map((po) => ({ x: +po.x.toFixed(2), y: +po.y.toFixed(2), nom: po.nom, type: po.type })),
    zones: m.t.zones,
    arbres: m.t.arbres.map((a) => a.map((v) => +v.toFixed(2))),
    sol: compresser(m.t.sol),
    champ: compresser(champ),
    agents: compresser(agents),
    mesure: {
      jour: +me.t.toFixed(2), sentiers: Math.round(me.sentiers), detour: +me.detour.toFixed(4), confort: +me.confort.toFixed(3),
      passages: me.passages, livrees: me.livrees, partA: +me.partA.toFixed(3),
    },
  }
}

/** Décode une image de fiche en une image que rendu2d.js sait dessiner */
export async function decoder(c) {
  const n = c.W * c.H
  const [sol, brut, a] = await Promise.all([decompresser(c.sol), decompresser(c.champ), decompresser(c.agents)])
  const fourmis = c.modele === 'fourmis'
  const champ = new Uint8Array(n), champ2 = new Uint8Array(n)
  for (let k = 0; k < n; k++) {
    if (fourmis) { champ[k] = (brut[k] >> 4) * 17; champ2[k] = (brut[k] & 15) * 17 } else champ[k] = brut[k] * 17
  }
  const na = a.length / 5
  const agents = new Float32Array(na * 4)
  for (let i = 0; i < na; i++) {
    agents[4 * i] = ((a[5 * i] | (a[5 * i + 1] << 8)) / 64) * c.h
    agents[4 * i + 1] = ((a[5 * i + 2] | (a[5 * i + 3] << 8)) / 64) * c.h
    agents[4 * i + 2] = a[5 * i + 4]
  }
  return {
    W: c.W, H: c.H, h: c.h, version: 1, fond: c.fond, modele: c.modele,
    sol, arbres: c.arbres, portes: c.portes, zones: c.zones,
    champ, champ2, agents, na,
  }
}
