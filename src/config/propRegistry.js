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

import Borne from '../components/props/bornes/Borne'
import BorneInfo from '../components/props/bornes/BorneInfo'
import Carrousel from '../components/props/bornes/Carrousel'
import PortiqueEntree from '../components/props/bornes/PortiqueEntree'
import PortiqueSortie from '../components/props/bornes/PortiqueSortie'
import Jukebox from '../components/props/loisirs/Jukebox'

import AffichePaysage from '../components/props/signaletique/AffichePaysage'







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



export const COMPONENTS = {
  cookie_stand: StandCookie,
  departures:   PanneauDeparts,
  vending: Distributeur,
  bookshelf:    Bibliotheque,

  banquette_2p:       Banquette2p,
  banquette_4p:       Banquette4p,
  banquette_dos:      BanquetteDosADos,
  banquette_tablette: BanquetteTablette,
  banc_ilot:          BancIlot,
  fauteuil:           Fauteuil,

  borne:      Borne,
  borne_info: BorneInfo,
  carrousel:  Carrousel,
  portique_entree: PortiqueEntree,
  portique_sortie: PortiqueSortie,
  jukebox: Jukebox,

  affiche_paysage: AffichePaysage,
  
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
}