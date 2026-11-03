// ============================================================
//  BOIDS : les scénarios de l'explorateur
//  Chaque scénario part des réglages par défaut (moteur.js) et en
//  change quelques-uns. « obstacles » : un décor posé au départ.
//  « vitesse » : le cran de vitesse (pas par image) qui lui va.
//  Les chiffres en commentaire viennent du moteur (tests en Node,
//  2 000 pas, plusieurs graines).
// ============================================================

const tous = (x) => [x, x, x]

// Une forêt de colonnes régulière, légèrement décalée d'un rang à l'autre
function foret(L) {
  const liste = []
  const pas = 7
  for (let y = pas / 2, r = 0; y < L; y += pas, r++) {
    for (let x = (r % 2 ? pas : pas / 2); x < L; x += pas) liste.push(x, y, 1.1)
  }
  return liste
}

export const DECORS = { foret }

export const SCENARIOS = [
  // Les trois règles de Reynolds : des nuées se forment et filent (polarisation ≈ 0,9)
  { id: 'reynolds', r: {}, vitesse: 2 },
  // Sans alignement : des grappes qui grouillent sur place, aucun vol d'ensemble (polarisation ≈ 0,05)
  { id: 'sans-alignement', r: { alignement: tous(0), cohesion: tous(1.5) }, vitesse: 2, vue: 'cap' },
  // Étourneaux : les 7 plus proches voisins au lieu d'un rayon, et un faucon
  { id: 'etourneaux', r: { n: 4000, voisinage: 'topologique', k: 7, predateurs: 1 }, vitesse: 2, vue: 'peur' },
  // Faucons : la nuée s'ouvre devant eux (« flash expansion ») et se referme derrière
  { id: 'faucons', r: { n: 2000, predateurs: 3 }, vitesse: 2, vue: 'peur' },
  // Forêt : la nuée se coupe autour des colonnes et se reforme derrière
  { id: 'foret', r: { n: 1500 }, obstacles: 'foret', vitesse: 2 },
  // Vent : un courant qui forcit et tourne par rafales
  { id: 'vent', r: { vent: 0.6, capVent: 20, rafales: 0.8 }, vitesse: 2 },
  // Trois espèces qui s'évitent : des bandes séparées, chacune à sa vitesse
  { id: 'especes', r: { n: 1800, especes: 3, relation: 'evitent', vitesse: [1, 1.2, 0.85] }, vitesse: 2 },
  // Vicsek : vitesse constante, cap moyen des voisins, bruit η ; ici, près de la transition
  { id: 'vicsek', r: { modele: 'vicsek', n: 2000, densite: 4, eta: 3, v0: 0.03 }, vitesse: 4, vue: 'cap' },
  // Bandes de Grégoire et Chaté : l'ordre arrive en bandes denses qui traversent le monde
  { id: 'bandes', r: { modele: 'vicsek', n: 4608, densite: 2, v0: 0.5, eta: 3.77, vectoriel: true }, vitesse: 2 },
  // Couzin : zone d'orientation nulle → un essaim compact, sans direction (polarisation ≈ 0,15)
  { id: 'essaim', r: { modele: 'couzin', n: 100, zoo: 0, zoa: 12 }, vitesse: 2 },
  // Couzin : zone d'orientation étroite → un tore, un banc qui tourne autour d'un vide (rotation ≈ 0,9)
  { id: 'tore', r: { modele: 'couzin', n: 100, zoo: 1, zoa: 12 }, vitesse: 2 },
  // Couzin : zone d'orientation large → une migration en rangs serrés (polarisation ≈ 1)
  { id: 'migration', r: { modele: 'couzin', n: 100, zoo: 8, zoa: 12 }, vitesse: 2 },
  // Couzin et al. 2005 : 10 % d'informés (orange) entraînent tout le groupe vers la droite (en 3D : un groupe parallèle)
  { id: 'meneurs', r: { modele: 'couzin', dim: 3, n: 100, zoo: 4, zoa: 10, sigma: 0.01, informes: 0.1, poids: 0.5 }, vitesse: 2 },
  // Deux minorités qui veulent aller dans deux directions séparées de 140° (préférence forte, ω = 1) : le groupe choisit
  { id: 'conflit', r: { modele: 'couzin', dim: 3, n: 100, zoo: 4, zoa: 10, sigma: 0.01, informes: 0.1, informes2: 0.1, ecart: 140, poids: 1 }, vitesse: 2 },
  // Cucker-Smale : β ≤ 1/2, tout le monde finit par voler à la même vitesse, dans le même sens
  { id: 'cucker', r: { modele: 'cucker', n: 200, beta: 0.3 }, vitesse: 3, vue: 'cap' },
]

export const scenario = (id) => SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]
