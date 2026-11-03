import { creerMonde, avancer, mesurer, regler, imageDe, peindre, basculerPorte, poidsPorte, paverSentiers, effacerSentiers, rafraichir } from './moteur.js'

// ============================================================
//  LIGNES DE DÉSIR : l'hôte de la simulation
//  Reçoit des messages (créer, régler, peindre, poser une porte,
//  avancer d'une image) et répond par des « images » : l'usure du sol
//  (un octet par case), les marcheurs ou les fourmis, les portes. Les
//  tableaux font l'aller-retour sans copie (objets transférables).
//  Le sol lui-même n'est renvoyé que lorsqu'il a changé.
//  Tourne dans le Web Worker (travail.js), ou sur le fil principal si
//  le navigateur n'en a pas (simulateur.js).
// ============================================================

const MESURE_MS = 250
const CALME_MS = 200     // après un coup de pinceau, on attend ce calme avant de recalculer les distances

const horloge = () => performance.now()

export function creerHote(poster) {
  let m = null
  let derniereMesure = -Infinity
  let dernierePeinture = 0

  function image(d) {
    if (m.sale && horloge() - dernierePeinture > CALME_MS) rafraichir(m)
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
    const img = imageDe(m, d.tampons ?? {}, d.version !== m.version)
    const reponse = { type: 'image', ...img, fait, ms, mesure, calcul: m.sale }
    const transferts = [img.champ.buffer, img.champ2.buffer, img.agents.buffer]
    if (img.sol) transferts.push(img.sol.buffer)
    poster(reponse, transferts)
  }

  return function traiter(d) {
    switch (d.type) {
      case 'creer':
        // sans terrain : on garde celui du monde actuel (avec ses retouches), herbe neuve
        m = creerMonde(d.terrain ?? m.t, d.reglages ?? m.p, d.graine)
        derniereMesure = -Infinity
        break
      case 'regler':
        if (m) regler(m, d.reglages)
        break
      case 'peindre':
        if (m) { peindre(m, d.sol, d.x, d.y, d.rayon, d.x0 ?? null, d.y0 ?? null); dernierePeinture = horloge() }
        break
      case 'porte':
        if (m) basculerPorte(m, d.x, d.y, d.genre)
        break
      case 'poids':
        if (m) poidsPorte(m, d.k, d.poids)
        break
      case 'paver':
        if (m) paverSentiers(m)
        break
      case 'effacer':
        if (m) effacerSentiers(m)
        break
      case 'image':
        if (m) image(d)
        break
      default:
    }
  }
}
