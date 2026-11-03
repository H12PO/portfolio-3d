import { creerHote } from './hote.js'

// ============================================================
//  BOIDS : le Web Worker
//  Le calcul tourne ici, à côté de la page : l'interface et le
//  dessin restent fluides même avec 5 000 oiseaux.
// ============================================================

const traiter = creerHote((reponse, transferts) => self.postMessage(reponse, transferts))
self.onmessage = (e) => traiter(e.data)
