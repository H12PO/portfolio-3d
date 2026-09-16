// ============================================================
//  Registre : type de prop -> composant React.
//  Séparé de props.js, qui ne contient que de la donnée et se fait
//  écraser par l'export de l'éditeur.
// ============================================================

import StandCookie from '../components/props/bornes/StandCookie'
import PanneauDeparts from '../components/props/bornes/PanneauDeparts'
import DistributeurBoissons from '../components/props/bornes/DistributeurBoissons'
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

import BagageMallette from '../components/props/bagages/BagageMallette'
import BagageSacADos from '../components/props/bagages/BagageSacADos'
import BagageSacMarin from '../components/props/bagages/BagageSacMarin'
import BagageSacVoyage from '../components/props/bagages/BagageSacVoyage'
import BagageValiseCabine from '../components/props/bagages/BagageValiseCabine'
import BagageValiseRigide from '../components/props/bagages/BagageValiseRigide'


export const COMPONENTS = {
  cookie_stand: StandCookie,
  departures:   PanneauDeparts,
  vending:      DistributeurBoissons,
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

  bag_mallette:      BagageMallette,
  bag_sac_a_dos:     BagageSacADos,
  bag_sac_marin:     BagageSacMarin,
  bag_sac_voyage:    BagageSacVoyage,
  bag_valise_cabine: BagageValiseCabine,
  bag_valise_rigide: BagageValiseRigide,


}