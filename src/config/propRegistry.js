// ============================================================
//  Registre : type de prop -> composant React.
//  Séparé de props.js, qui ne contient que de la donnée et se fait
//  écraser par l'export de l'éditeur.
// ============================================================

import StandCookie from '../components/props/bornes/StandCookie'
import PanneauDeparts from '../components/props/bornes/PanneauDeparts'
import Distributeur from '../components/props/bornes/Distributeur'
import Bibliotheque from '../components/props/bornes/Bibliotheque'

import Banquette2p from '../components/props/sieges/Banquette2p'
import Banquette4p from '../components/props/sieges/Banquette4p'
import BanquetteDosADos from '../components/props/sieges/BanquetteDosADos'
import BanquetteTablette from '../components/props/sieges/BanquetteTablette'
import BancIlot from '../components/props/sieges/BancIlot'
import Fauteuil from '../components/props/sieges/Fauteuil'
import TableBasseGrande from "../components/props/sieges/TableBasseGrande.jsx";

import Borne from '../components/props/bornes/Borne'
import BorneInfo from '../components/props/bornes/BorneInfo'
import Carrousel from '../components/props/bornes/Carrousel'
import PortiqueEntree from '../components/props/bornes/PortiqueEntree'
import PortiqueSortie from '../components/props/bornes/PortiqueSortie'
import Jukebox from '../components/props/loisirs/Jukebox'

import AffichePaysage from '../components/props/signaletique/AffichePaysage'
import PorteService from "../components/props/decor/PorteService.jsx";
import ChariotNettoyage from "../components/props/decor/ChariotNettoyage.jsx";
import AffichePortrait from "../components/props/signaletique/AffichePortrait.jsx";
import PortiqueDetection from "../components/props/securite/PortiqueDetection.jsx";
import ScannerBagages from "../components/props/securite/ScannerBagages.jsx";
import BureauControle from "../components/props/securite/BureauControle.jsx";
import ChaiseControle from "../components/props/securite/ChaiseControle.jsx";


import BarrierePoteau from "../components/props/decor/BarrierePoteau.jsx";
import BarriereSegment from "../components/props/decor/BarriereSegment.jsx";




import BagageMallette from '../components/props/bagages/BagageMallette'
import BagageSacADos from '../components/props/bagages/BagageSacADos'
import BagageSacMarin from '../components/props/bagages/BagageSacMarin'
import BagageSacVoyage from '../components/props/bagages/BagageSacVoyage'
import BagageValiseCabine from '../components/props/bagages/BagageValiseCabine'
import BagageValiseRigide from '../components/props/bagages/BagageValiseRigide'

import BacFleuri from '../components/props/vegetation/BacFleuri'
import BacHortensias from '../components/props/vegetation/BacHortensias'
import BacExotique from '../components/props/vegetation/BacExotique'
import BacRoses from '../components/props/vegetation/BacRoses'
import BacChampetre from '../components/props/vegetation/BacChampetre'

import JardDeuxFaces from '../components/props/vegetation/JardDeuxFaces'
import JardEpis from '../components/props/vegetation/JardEpis'
import JardHauteMixte from '../components/props/vegetation/JardHauteMixte'
import JardMassifFleuri from '../components/props/vegetation/JardMassifFleuri'
import JardTreillis from '../components/props/vegetation/JardTreillis'
import BacCactus from '../components/props/vegetation/BacCactus'
import SujetFeuillesLarges from '../components/props/vegetation/SujetFeuillesLarges'
import SujetFougere from '../components/props/vegetation/SujetFougere'
import SujetMonstera from '../components/props/vegetation/SujetMonstera'
import SujetPalmier from '../components/props/vegetation/SujetPalmier'
import PetitCoupeGrasses from '../components/props/vegetation/PetitCoupeGrasses'
import PetitPotBureau from '../components/props/vegetation/PetitPotBureau'
import PetitTerracottaClochettes from '../components/props/vegetation/PetitTerracottaClochettes'
import PetitTerracottaFleuri from '../components/props/vegetation/PetitTerracottaFleuri'
import SuspensionFeuillage from '../components/props/vegetation/SuspensionFeuillage'
import SuspensionFleurie from '../components/props/vegetation/SuspensionFleurie'
import BouteilleEau from "../components/props/objets/BouteilleEau.jsx";
import Canette from "../components/props/objets/Canette.jsx";
import CarteEmbarquement from "../components/props/objets/CarteEmbarquement.jsx";
import CasqueAudio from "../components/props/objets/CasqueAudio.jsx";
import GobeletCafe from "../components/props/objets/GobeletCafe.jsx";
import JournalOuvert from "../components/props/objets/JournalOuvert.jsx";
import JournalPlie from "../components/props/objets/JournalPlie.jsx";
import LivrePoche from "../components/props/objets/LivrePoche.jsx";
import Magazine from "../components/props/objets/Magazine.jsx";
import MugIsotherme from "../components/props/objets/MugIsotherme.jsx";
import PileProspectus from "../components/props/objets/PileProspectus.jsx";
import PorteGobelets from "../components/props/objets/PorteGobelets.jsx";
import SacBoutique from "../components/props/objets/SacBoutique.jsx";
import SachetSnack from "../components/props/objets/SachetSnack.jsx";
import Telephone from "../components/props/objets/Telephone.jsx";
import Arcade from '../components/props/loisirs/Arcade'
import AfficheGrand from '../components/props/signaletique/AfficheGrand'
import PoubelleTri from '../components/props/decor/PoubelleTri'
import PanneauSolGlissant from '../components/props/decor/PanneauSolGlissant'
import TableBassePetite from '../components/props/sieges/TableBassePetite'


export const COMPONENTS = {
  cookie_stand: StandCookie,
  departures:   PanneauDeparts,
  vending: Distributeur,
  bookshelf:    Bibliotheque,

  arcade: Arcade,                            // à côté de jukebox
  affiche_grand: AfficheGrand,               // à côté des deux autres affiches
  poubelle_tri: PoubelleTri,                 // à côté de porte_service
  panneau_sol_glissant: PanneauSolGlissant,  // idem
  table_basse_pt: TableBassePetite,          // à côté de table_basse_gd

  banquette_2p:       Banquette2p,
  banquette_4p:       Banquette4p,
  banquette_dos:      BanquetteDosADos,
  banquette_tablette: BanquetteTablette,
  banc_ilot:          BancIlot,
  fauteuil:           Fauteuil,
  table_basse_gd:     TableBasseGrande,

  borne:      Borne,
  borne_info: BorneInfo,
  carrousel:  Carrousel,
  portique_entree: PortiqueEntree,
  portique_sortie: PortiqueSortie,
  jukebox: Jukebox,
  portique_detection:PortiqueDetection,
  scanner_bagages:ScannerBagages,
  bureau_controle:BureauControle,
  chaise_controle:ChaiseControle,


  affiche_paysage: AffichePaysage,
  affiche_portrait : AffichePortrait,
  porte_service : PorteService,
  chariot_nettoyage : ChariotNettoyage,


  barriere_segment:BarriereSegment,
  barriere_poteau: BarrierePoteau,


  bag_mallette:      BagageMallette,
  bag_sac_a_dos:     BagageSacADos,
  bag_sac_marin:     BagageSacMarin,
  bag_sac_voyage:    BagageSacVoyage,
  bag_valise_cabine: BagageValiseCabine,
  bag_valise_rigide: BagageValiseRigide,


  bac_fleuri:     BacFleuri,
  bac_hortensias: BacHortensias,
  bac_exotique:   BacExotique,
  bac_roses:      BacRoses,
  bac_champetre:  BacChampetre,


  jard_deux_faces:    JardDeuxFaces,
  jard_epis:          JardEpis,
  jard_haute_mixte:   JardHauteMixte,
  jard_massif_fleuri: JardMassifFleuri,
  jard_treillis:      JardTreillis,
  bac_cactus:         BacCactus,

  sujet_feuilles_larges: SujetFeuillesLarges,
  sujet_fougere:         SujetFougere,
  sujet_monstera:        SujetMonstera,
  sujet_palmier:         SujetPalmier,

  petit_coupe_grasses:         PetitCoupeGrasses,
  petit_pot_bureau:            PetitPotBureau,
  petit_terracotta_clochettes: PetitTerracottaClochettes,
  petit_terracotta_fleuri:     PetitTerracottaFleuri,
  suspension_feuillage:        SuspensionFeuillage,
  suspension_fleurie:          SuspensionFleurie,

  bouteille_eau:      BouteilleEau,
  canette: Canette,
  carte_embarquement: CarteEmbarquement,
  casque_audio: CasqueAudio,
  gobelet_cafe: GobeletCafe,
  journal_ouvert: JournalOuvert,
  journal_plie: JournalPlie,
  livre_poche: LivrePoche,
  magazine: Magazine,
  mug_isotherme: MugIsotherme,
  pile_prospectus: PileProspectus,
  porte_gobelets: PorteGobelets,
  sac_boutique: SacBoutique,
  sachet_snack: SachetSnack,
  telephone: Telephone,



}