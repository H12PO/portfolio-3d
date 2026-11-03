import { creerMonde, avancer, mesurer, regler, boite, ajouterObstacle, effacerObstacles, poserObstacles } from './moteur.js'

// ============================================================
//  BOIDS : l'hôte de la simulation
//  Reçoit des messages (créer, régler, peindre, avancer d'une image)
//  et répond par des « images » : l'état de chaque oiseau dans un
//  tableau Float32Array de 8 nombres par oiseau, que l'on se renvoie
//  d'un côté à l'autre sans copie (objets transférables).
//  Tourne dans le Web Worker (travail.js), ou sur le fil principal
//  si le navigateur n'en a pas (simulateur.js).
//
//  Un oiseau dans l'image : x, y, z, vx, vy, vz, couleur, peur
//    couleur : l'espèce (boids), ou 3 + préférence (meneurs de Couzin)
//    peur    : 0 à 1, la panique devant un prédateur
// ============================================================

export const PAR_OISEAU = 8
const MESURE_MS = 250

const horloge = () => performance.now()

/**
 * L'image d'un monde : ce qu'il faut pour le dessiner (rendu2d.js, rendu3d.js).
 * @param tampon un Float32Array à réutiliser (sinon, un neuf)
 */
export function imageDe(m, tampon = null) {
  const { N, pos, vel } = m
  const etat = tampon && tampon.length === N * PAR_OISEAU ? tampon : new Float32Array(N * PAR_OISEAU)
  const couzin = m.p.modele === 'couzin'
  for (let i = 0; i < N; i++) {
    const o = 3 * i
    const e = PAR_OISEAU * i
    etat[e] = pos[o]; etat[e + 1] = pos[o + 1]; etat[e + 2] = pos[o + 2]
    etat[e + 3] = vel[o]; etat[e + 4] = vel[o + 1]; etat[e + 5] = vel[o + 2]
    etat[e + 6] = couzin ? (m.prefere[i] ? 2 + m.prefere[i] : 0) : m.espece[i]
    etat[e + 7] = m.peurs[i]
  }
  const nPred = m.p.modele === 'boids' ? m.p.predateurs : 0
  const pred = new Float32Array(nPred * 6)
  for (let k = 0; k < nPred; k++) {
    for (let a = 0; a < 3; a++) {
      pred[6 * k + a] = m.pred[3 * k + a]
      pred[6 * k + 3 + a] = m.predVel[3 * k + a]
    }
  }
  return {
    N, D: m.D, L: m.L, bords: m.bords, modele: m.p.modele,
    boite: boite(m),
    etat,
    pred,
    obstacles: m.obstacles.slice(0, 3 * m.nObstacles),
    souris: m.souris.actif ? [m.souris.x, m.souris.y, m.souris.z] : null,
    peur: m.p.peur,
    t: m.t,
    pas: m.pas,
  }
}

export function creerHote(poster) {
  let m = null
  let derniereMesure = -Infinity
  let versionObstacles = 0

  function image(d) {
    const debut = horloge()
    let fait = 0
    while (fait < d.pas && horloge() - debut < d.budget) {
      avancer(m, 1)
      fait++
    }
    const ms = fait ? (horloge() - debut) / fait : 0
    let mesure = null
    if (d.mesurer || horloge() - derniereMesure > MESURE_MS) {
      mesure = mesurer(m)
      derniereMesure = horloge()
    }
    const reponse = { type: 'image', ...imageDe(m, d.tampon), versionObstacles, fait, ms, mesure }
    poster(reponse, [reponse.etat.buffer])
  }

  return function traiter(d) {
    if (d.type === 'creer') {
      m = creerMonde(d.reglages, d.graine)
      if (d.obstacles) poserObstacles(m, d.obstacles)
      versionObstacles++
      derniereMesure = -Infinity
      return
    }
    if (!m) return
    if (d.type === 'regler') regler(m, d.reglages)
    else if (d.type === 'obstacle') {
      if (d.efface) effacerObstacles(m, d.x, d.y, d.r)
      else ajouterObstacle(m, d.x, d.y, d.r)
      versionObstacles++
    } else if (d.type === 'obstacles') {
      poserObstacles(m, d.liste)
      versionObstacles++
    } else if (d.type === 'souris') Object.assign(m.souris, d.souris)
    else if (d.type === 'image') image(d)
  }
}
