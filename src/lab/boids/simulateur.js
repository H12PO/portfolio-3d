import { creerHote } from './hote.js'

// ============================================================
//  BOIDS : le simulateur vu de la page
//  Lance le Web Worker (travail.js). Sans Worker (vieux navigateur,
//  page de test), le même hôte tourne sur le fil principal, avec le
//  même protocole de messages : l'explorateur ne voit pas la différence.
// ============================================================

/**
 * @param surImage (image) => void, appelée à chaque image reçue
 * @returns {{ envoyer(message, transferts?), fermer(), local: boolean }}
 */
export function creerSimulateur(surImage) {
  let travailleur = null
  try {
    if (typeof Worker !== 'undefined') travailleur = new Worker(new URL('./travail.js', import.meta.url), { type: 'module' })
  } catch {
    travailleur = null
  }
  if (travailleur) {
    travailleur.onmessage = (e) => surImage(e.data)
    return {
      envoyer: (message, transferts = []) => travailleur.postMessage(message, transferts),
      fermer: () => travailleur.terminate(),
      local: false,
    }
  }
  let ouvert = true
  const traiter = creerHote((reponse) => { if (ouvert) surImage(reponse) })
  return {
    // asynchrone, comme un vrai Worker : la réponse arrive après le message
    envoyer: (message) => setTimeout(() => { if (ouvert) traiter(message) }, 0),
    fermer: () => { ouvert = false },
    local: true,
  }
}
