
/**
 * Position des bagages sur le tapis, publiee par CarrouselBagages et lue
 * par les portiques. Un objet mutable plutot qu'un store Zustand : la
 * donnee change a chaque image, elle n'a rien a faire dans du state React.
 *
 * ecart : distance laterale du bagage au centre du portique, en metres.
 *         null quand aucun bagage n'est dans la zone.
 * avance : de -1 a +1, position du bagage le long de l'axe de passage.
 *          Negatif avant le portique, positif apres.
 */
export const CARROUSEL = {
  entree: { ecart: null, avance: 0, demi: 0.25 },
  sortie: { ecart: null, avance: 0, demi: 0.25 },
}