import { creerHote } from './hote.js'

// ============================================================
//  LIGNES DE DÉSIR : le Web Worker
//  Le calcul (marcheurs, usure, cartes des distances) tourne ici,
//  à côté de la page : l'interface reste fluide.
// ============================================================

const traiter = creerHote((reponse, transferts) => self.postMessage(reponse, transferts))
self.onmessage = (e) => traiter(e.data)
