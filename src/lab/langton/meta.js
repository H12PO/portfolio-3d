export default {
  titre: {
    fr: 'Fourmi de Langton',
    en: "Langton's ant",
  },
  resume: {
    fr: 'Deux règles, une fourmi : 10 000 pas de chaos, puis une autoroute sort de nulle part.',
    en: 'Two rules, one ant: 10,000 steps of chaos, then a highway appears out of nowhere.',
  },
  domaine: 'simulations',  // voir DOMAINES dans registre.js
  rang: 1,                 // place dans le classement de la feuille de route
  statut: 'fini',          // 'fini' | 'wip' | 'idee'
  techno: 'Canvas 2D',
  annee: 2026,
  visibilite: 'public',    // 'public' | 'protege' (pas encore branché)
  calcul: 'navigateur',    // 'navigateur' | 'precalcul' | 'backend'
  arcade: 'jouable',       // 'jouable' | 'demo' | false
}
