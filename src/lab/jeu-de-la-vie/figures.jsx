import { useEffect, useMemo, useRef, useState } from 'react'
import Graphique from '../commun/Graphique'
import { preparer } from '../commun/graphes'
import { generateur } from '../commun/aleatoire.js'
import { creerMonde, avancer, placer, toutEffacer, soupe, ecrire } from './moteur.js'
import { creerRendu, THEMES } from './rendu'
import { motif, lireRLE } from './motifs.js'
import { creerHashlife } from './hashlife.js'
import { LIFE, REGLES } from './regles'
import { lambda } from './calcul.js'

// ============================================================
//  FIGURES DU JEU DE LA VIE
//  Toutes tournent sur le vrai moteur, dans le navigateur.
// ============================================================

/* ---------- Une petite simulation qui tourne en boucle ---------- */

const JAMAIS_FINI = () => false

/**
 * @param cellules  motif de départ [[x, y, état]]
 * @param bords     'ferme' | 'tore'
 * @param boite     zone à cadrer { x0, y0, x1, y1 } (monde de 32 × 32)
 * @param vitesse   générations par seconde
 * @param fin       (monde) → true quand l'histoire est finie : pause, puis on recommence
 * @param regle     règle lue par lireRegle (le jeu de la vie par défaut)
 */
function MiniVie({ cellules, W = 32, H = 32, position, bords = 'ferme', regle = LIFE, boite, vitesse = 8, fin = JAMAIS_FINI, theme, label, className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const e = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(canvas.clientWidth * e)
    canvas.height = Math.round(canvas.clientHeight * e)

    const m = creerMonde({ W, H, bords, regle })
    const [ox, oy] = position ?? [
      (W >> 1) - Math.round((Math.max(...cellules.map((c) => c[0])) + 1) / 2),
      (H >> 1) - Math.round((Math.max(...cellules.map((c) => c[1])) + 1) / 2),
    ]
    const repartir = () => {
      toutEffacer(m)
      placer(m, cellules, ox, oy)
    }
    repartir()
    const rendu = creerRendu(canvas, m)
    rendu.recentrer(boite)

    let visible = true
    const obs = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    obs.observe(canvas)

    let raf = 0
    let dernier = performance.now()
    let accumule = 0
    let attente = 0 // ms de pause à la fin d'une histoire
    const image = (t) => {
      raf = requestAnimationFrame(image)
      const dt = Math.min(100, t - dernier)
      dernier = t
      if (!visible) return
      if (attente > 0) {
        attente -= dt
        if (attente <= 0) repartir()
      } else {
        accumule += (dt * vitesse) / 1000
        while (accumule >= 1) {
          accumule -= 1
          avancer(m, 1)
          if (fin(m)) { attente = 1800; accumule = 0; break }
        }
      }
      rendu.dessiner({ effets: { quadrillage: true, age: true, trainees: true }, theme })
    }
    raf = requestAnimationFrame(image)
    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [cellules, W, H, position, bords, regle, boite, vitesse, fin, theme])

  return <canvas ref={canvasRef} className={className} role="img" aria-label={label} />
}

/* ---------- Quatre destins (onglet Comprendre) ---------- */

// Motifs trouvés par une recherche systématique parmi les petits motifs de 4 × 4 cases :
// le premier s'éteint en 45 générations, le second se fige en 53.
const MEURT = [[3, 0, 1], [3, 1, 1], [0, 2, 1], [1, 2, 1], [2, 2, 1], [0, 3, 1], [3, 3, 1]]
const FIGE = [[0, 0, 1], [1, 0, 1], [3, 0, 1], [2, 1, 1], [0, 2, 1], [3, 2, 1], [0, 3, 1], [1, 3, 1], [2, 3, 1]]
const CADRE = { x0: 6, y0: 6, x1: 25, y1: 25 }
const PLEIN = { x0: 0, y0: 0, x1: 31, y1: 31 }

const DESTINS = [
  { id: 'meurt', cellules: MEURT, fin: (m) => m.population === 0, boite: CADRE },
  { id: 'fige', cellules: FIGE, fin: (m) => m.gen >= 60, boite: CADRE },
  { id: 'oscille', cellules: motif('pulsar').cellules, vitesse: 4, boite: CADRE },
  { id: 'voyage', cellules: motif('planeur').cellules, bords: 'tore', boite: PLEIN },
]

export function FigureDestins({ txt, theme }) {
  return (
    <div className="destins">
      {DESTINS.map((d, k) => (
        <figure key={d.id}>
          <MiniVie {...d} theme={theme} label={`${txt[k][0]}. ${txt[k][1]}`} />
          <figcaption>{txt[k][0]}<span>{txt[k][1]}</span></figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------- Théorie 1 : la règle sur une case et ses huit voisines ---------- */

export function FigureVoisinage({ txt }) {
  // Départ : un clignotant vertical, la case centrale a 2 voisines et survit
  const [cases, setCases] = useState([0, 1, 0, 0, 1, 0, 0, 1, 0])
  const n = cases.reduce((s, v, k) => s + (k !== 4 ? v : 0), 0)
  const centre = cases[4]
  const suivant = n === 3 ? 1 : n === 2 ? centre : 0
  const basculer = (k) => setCases((c) => c.map((v, j) => (j === k ? 1 - v : v)))

  return (
    <figure className="figure">
      <div className="voisinage" role="group" aria-label={txt.groupe}>
        {cases.map((v, k) => (
          <button
            key={k}
            className={k === 4 ? 'voisinage-centre' : undefined}
            aria-pressed={!!v}
            aria-label={k === 4 ? txt.centre : txt.voisine}
            onClick={() => basculer(k)}
          />
        ))}
      </div>
      <figcaption>
        <p>{txt.legende}</p>
        <p className="figure-etat" aria-live="polite">{txt.compte(n)}</p>
        <p className="voisinage-verdict" data-vivante={suivant === 1}>{txt.verdict(centre, n, suivant)}</p>
      </figcaption>
    </figure>
  )
}

/* ---------- Théorie 2 : les quatre phases du planeur ---------- */

const U = 14 // taille d'une case dans les petites grilles SVG

export function FigurePlaneur({ txt }) {
  const phases = useMemo(() => {
    const m = creerMonde({ W: 32, H: 32 })
    placer(m, motif('planeur').cellules, 1, 1)
    const res = []
    for (let g = 0; g <= 4; g++) {
      const c = []
      for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) if (m.etat[y * 32 + x]) c.push([x, y])
      res.push(c)
      avancer(m, 1)
    }
    return res
  }, [])

  return (
    <figure className="figure figure--large">
      <div className="planeur-phases">
        {phases.map((c, g) => (
          <div key={g}>
            <svg viewBox={`0 0 ${6 * U} ${6 * U}`} role="img" aria-label={txt.phase(g)}>
              <rect className="mini-feuille" width={6 * U} height={6 * U} />
              {Array.from({ length: 5 }, (_, k) => (
                <g key={k}>
                  <line className="mini-grille" x1={(k + 1) * U} x2={(k + 1) * U} y1={0} y2={6 * U} />
                  <line className="mini-grille" y1={(k + 1) * U} y2={(k + 1) * U} x1={0} x2={6 * U} />
                </g>
              ))}
              {/* Position de départ, pour voir le décalage */}
              {g === 4 && <rect className="mini-depart" x={U + 1} y={U + 1} width={3 * U - 2} height={3 * U - 2} />}
              {c.map(([x, y]) => <rect key={`${x},${y}`} className="mini-cellule" x={x * U + 1} y={y * U + 1} width={U - 2} height={U - 2} />)}
            </svg>
            <span>{txt.gen(g)}</span>
          </div>
        ))}
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie 3 : le canon de Gosper et sa population ---------- */

const GOSPER = motif('gosper')
const CADRE_CANON = { x0: 0, y0: 0, x1: 76, y1: 58 }
const POSITION_CANON = [4, 4]
const FIN_CANON = (m) => m.gen >= 300

export function FigureCanon({ txt, theme, fmt }) {
  const points = useMemo(() => {
    const m = creerMonde({ W: 256, H: 256 })
    placer(m, GOSPER.cellules, 10, 10)
    const p = []
    for (let g = 0; g <= 600; g++) {
      if (g % 5 === 0) p.push([g, m.population])
      avancer(m, 1)
    }
    return p
  }, [])

  return (
    <>
      <figure className="figure figure--large">
        <MiniVie
          cellules={GOSPER.cellules}
          W={128}
          H={96}
          position={POSITION_CANON}
          boite={CADRE_CANON}
          vitesse={20}
          fin={FIN_CANON}
          theme={theme}
          label={txt.label}
          className="figure-vaste"
        />
        <figcaption><p>{txt.legende}</p></figcaption>
      </figure>
      <Graphique
        titre={txt.titre}
        series={[{ id: 'pop', nom: txt.titre, points, couleur: 'var(--sig)', trace: 'ligne' }]}
        x={{ min: 0, max: 600, ticks: [0, 100, 200, 300, 400, 500, 600], titre: txt.axeX, format: fmt }}
        y={{ min: 0, max: 160, ticks: [0, 40, 80, 120, 160], titre: txt.axeY, format: fmt }}
        reperes={[{ x: 15, texte: txt.premier }]}
        info={(g, v) => txt.info(fmt(g), fmt(v[0].y))}
        resume={txt.resume}
        tableau={{
          titre: txt.donnees,
          colonnes: [txt.colGen, txt.colPop],
          lignes: points.filter(([g]) => g % 50 === 0).map(([g, p]) => [fmt(g), fmt(p)]),
        }}
      />
    </>
  )
}

/* ---------- Théorie 4 : deux jumeaux, même avenir ---------- */

const VUE_J = 11      // fenêtre affichée : 11 × 11 cases
const ORIGINE_J = 10  // coin de la fenêtre dans un monde de 32 × 32
const CENTRE_J = ORIGINE_J + 5

function grillesJumelles(graine, gen) {
  const alea = generateur(graine)
  const mondes = [creerMonde({ W: 32, H: 32 }), creerMonde({ W: 32, H: 32 })]
  // Entourage commun au hasard, hors du carré central de 5 × 5 qui reste vide
  for (let y = 0; y < VUE_J; y++) {
    for (let x = 0; x < VUE_J; x++) {
      const dansCarre = Math.abs(x - 5) <= 2 && Math.abs(y - 5) <= 2
      if (!dansCarre && alea() < 0.4) for (const m of mondes) ecrire(m, ORIGINE_J + x, ORIGINE_J + y, 1)
    }
  }
  ecrire(mondes[1], CENTRE_J, CENTRE_J, 1) // la seule différence : la case centrale
  for (const m of mondes) avancer(m, gen)
  return mondes.map((m) => {
    const g = new Uint8Array(VUE_J * VUE_J)
    for (let y = 0; y < VUE_J; y++) for (let x = 0; x < VUE_J; x++) g[y * VUE_J + x] = m.etat[(ORIGINE_J + y) * 32 + ORIGINE_J + x]
    // l'égalité porte sur tout le monde, pas seulement sur la fenêtre affichée
    return { g, tout: m.etat }
  })
}

function dessinerJumeau(canvas, grille, theme, gen, marquer) {
  const { ctx, e } = preparer(canvas)
  const th = THEMES[theme]
  const z = canvas.width / VUE_J
  ctx.fillStyle = th.feuille
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = `rgba(${th.grille}, .9)`
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let k = 1; k < VUE_J; k++) {
    const p = Math.round(k * z) + 0.5
    ctx.moveTo(p, 0); ctx.lineTo(p, canvas.height)
    ctx.moveTo(0, p); ctx.lineTo(canvas.width, p)
  }
  ctx.stroke()
  for (let y = 0; y < VUE_J; y++) {
    for (let x = 0; x < VUE_J; x++) {
      if (!grille[y * VUE_J + x]) continue
      ctx.fillStyle = marquer && x === 5 && y === 5 && gen === 0 ? th.sig : th.encre
      ctx.fillRect(x * z + 1, y * z + 1, z - 2, z - 2)
    }
  }
  // Le carré de 5 × 5 des jumeaux
  ctx.strokeStyle = th.sig
  ctx.lineWidth = 2 * e
  ctx.setLineDash([5 * e, 4 * e])
  ctx.strokeRect(3 * z, 3 * z, 5 * z, 5 * z)
  ctx.setLineDash([])
}

export function FigureJumeaux({ txt, theme }) {
  const gauche = useRef(null)
  const droite = useRef(null)
  const [graine, setGraine] = useState(7)
  const [gen, setGen] = useState(0)
  const grilles = useMemo(() => grillesJumelles(graine, gen), [graine, gen])
  const identiques = grilles[0].tout.every((v, i) => v === grilles[1].tout[i])

  useEffect(() => {
    dessinerJumeau(gauche.current, grilles[0].g, theme, gen, false)
    dessinerJumeau(droite.current, grilles[1].g, theme, gen, true)
  }, [grilles, theme, gen])

  return (
    <figure className="figure figure--large">
      <div className="jumeaux">
        <div><canvas ref={gauche} role="img" aria-label={txt.titres[0]} /><span>{txt.titres[0]}</span></div>
        <div><canvas ref={droite} role="img" aria-label={txt.titres[1]} /><span>{txt.titres[1]}</span></div>
      </div>
      <figcaption>
        <p>{txt.legende}</p>
        <p className="figure-etat" aria-live="polite">{gen === 0 ? txt.depart : identiques ? txt.identiques(gen) : txt.differentes(gen)}</p>
        <div className="figure-actions">
          <button className="btn" onClick={() => setGen((g) => g + 1)}>{txt.unPas}</button>
          <button className="btn" onClick={() => { setGraine((g) => g + 1); setGen(0) }}>{txt.autre}</button>
        </div>
      </figcaption>
    </figure>
  )
}

/* ---------- Théorie 5 : soupes aléatoires contre champ moyen ---------- */

const COTE_SOUPE = 128
const FINE = String.fromCharCode(0x202f) // espace fine insécable avant « % »
const GENS_SOUPE = 2000
const GRAINES_SOUPE = 2
const DENSITES_SOUPE = Array.from({ length: 19 }, (_, k) => (k + 1) / 20)

// Champ moyen : densité suivante si les cases étaient indépendantes
function champMoyen(p) {
  const q = 1 - p
  return p * (28 * p ** 2 * q ** 6 + 56 * p ** 3 * q ** 5) + q * 56 * p ** 3 * q ** 5
}
const limiteChampMoyen = (p0) => {
  let p = p0
  for (let k = 0; k < 2000; k++) p = champMoyen(p)
  return p
}

export function FigureSoupes({ txt, lang }) {
  const [mesures, setMesures] = useState([])
  const [progres, setProgres] = useState(null) // nombre de soupes calculées pendant l'expérience
  const anim = useRef(0)

  useEffect(() => {
    const a = anim
    return () => cancelAnimationFrame(a.current)
  }, [])

  const theorie = useMemo(() => Array.from({ length: 201 }, (_, k) => [k / 200, limiteChampMoyen(k / 200)]), [])
  const total = DENSITES_SOUPE.length * GRAINES_SOUPE

  // Calcul découpé en morceaux de 20 ms : la page reste fluide pendant les ~40 000 générations
  const lancer = () => {
    cancelAnimationFrame(anim.current)
    const alea = generateur(2026)
    const m = creerMonde({ W: COTE_SOUPE, H: COTE_SOUPE, bords: 'tore' })
    const res = []
    let k = 0
    let somme = 0
    let enCours = false
    setMesures([])
    setProgres(0)
    const image = () => {
      const t0 = performance.now()
      while (k < total && performance.now() - t0 < 20) {
        const p = DENSITES_SOUPE[Math.floor(k / GRAINES_SOUPE)]
        if (!enCours) { soupe(m, { cote: COTE_SOUPE, densite: p, alea }); enCours = true }
        avancer(m, Math.min(200, GENS_SOUPE - m.gen))
        if (m.gen < GENS_SOUPE) continue
        enCours = false
        somme += m.population / (COTE_SOUPE * COTE_SOUPE)
        k++
        if (k % GRAINES_SOUPE === 0) { res.push([p, somme / GRAINES_SOUPE]); somme = 0 }
      }
      setMesures([...res])
      setProgres(k)
      if (k < total) anim.current = requestAnimationFrame(image)
      else setProgres(null)
    }
    anim.current = requestAnimationFrame(image)
  }

  const pc = (v, d = 0) => `${(v * 100).toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d })}${lang === 'en' ? '' : FINE}%`
  const fini = mesures.length === DENSITES_SOUPE.length

  return (
    <>
      <Graphique
        titre={txt.titre}
        series={[
          { id: 'champ', nom: txt.champ, points: theorie, couleur: 'var(--serie-2)', trace: 'ligne' },
          { id: 'mesure', nom: txt.mesure, points: mesures, couleur: 'var(--sig)', trace: 'les deux' },
        ]}
        x={{ min: 0, max: 1, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1], titre: txt.axeX, format: (v) => pc(v) }}
        y={{ min: 0, max: 0.4, ticks: [0, 0.1, 0.2, 0.3, 0.4], titre: txt.axeY, format: (v) => pc(v) }}
        info={(p, v) => txt.info(pc(p), v.map((x) => [x.serie.id === 'mesure' ? txt.mesure : txt.champ, pc(x.y, 1)]))}
        resume={txt.resume}
        tableau={fini ? {
          titre: txt.donnees,
          colonnes: [txt.colDepart, txt.colMesure, txt.colChamp],
          lignes: mesures.map(([p, d]) => [pc(p), pc(d, 2), pc(limiteChampMoyen(p), 1)]),
        } : null}
      />
      <div className="figure-actions figure-actions--sous">
        {progres === null
          ? <button className="btn" onClick={lancer}>{fini ? txt.relancer : txt.lancer}</button>
          : <p className="figure-etat" aria-live="polite">{txt.calcul(progres, total)}</p>}
        {progres === null && !fini && <p className="aide-figure">{txt.attente}</p>}
      </div>
    </>
  )
}

/* ---------- Théorie 3 (suite) : sauter dans le temps avec Hashlife ---------- */

const MOTIFS_SAUT = ['gosper', 'gland', 'ligne39']

// Durée d'un calcul, en millisecondes (au moins 1)
function chronometrer(calcul) {
  const t0 = performance.now()
  calcul()
  return Math.max(1, Math.round(performance.now() - t0))
}

function vueEnsemble(canvas, h, theme) {
  const { ctx } = preparer(canvas)
  const th = THEMES[theme]
  ctx.fillStyle = th.feuille
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  const b = h.boite()
  if (!b) return
  // On cadre la boîte entière, quelle que soit sa taille : un pixel montre un bloc de 2^L cases
  const marge = 0.06
  const w = b.x1 - b.x0 + 1
  const hh = b.y1 - b.y0 + 1
  const z = Math.min((canvas.width * (1 - 2 * marge)) / w, (canvas.height * (1 - 2 * marge)) / hh, 6)
  const ox = canvas.width / 2 - (b.x0 + w / 2) * z
  const oy = canvas.height / 2 - (b.y0 + hh / 2) * z
  const L = z >= 1 ? 0 : Math.ceil(Math.log2(1 / z))
  const t = 2 ** L
  ctx.fillStyle = th.encre
  h.blocs(L, { x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 }, (bx, by, d) => {
    ctx.globalAlpha = L === 0 ? 1 : Math.min(1, 0.6 + d * 4)
    ctx.fillRect(ox + bx * t * z, oy + by * t * z, Math.max(1, t * z), Math.max(1, t * z))
  })
  ctx.globalAlpha = 1
}

export function FigureSaut({ txt, theme, fmt }) {
  const canvasRef = useRef(null)
  const [id, setId] = useState('gosper')
  const [k, setK] = useState(20)
  const [resultat, setResultat] = useState(null) // { gen, pop, ms, noeuds, h }
  const [calcul, setCalcul] = useState(false)

  // Le calcul est fait au clic, après un court délai pour afficher « Calcul en cours »
  const calculer = () => {
    setCalcul(true)
    setTimeout(() => {
      const h = creerHashlife(LIFE)
      for (const [x, y] of motif(id).cellules) h.poser(x, y)
      const ms = chronometrer(() => h.sauter(k))
      setResultat({ id, k, gen: 2 ** k, pop: h.population(), ms, noeuds: h.noeuds(), h })
      setCalcul(false)
    }, 40)
  }

  useEffect(() => {
    if (resultat) vueEnsemble(canvasRef.current, resultat.h, theme)
  }, [resultat, theme])

  const lignes = resultat && [
    [txt.colGen, <>{fmt(resultat.gen)} (2<sup>{resultat.k}</sup>)</>],
    [txt.colPop, fmt(resultat.pop)],
    [txt.colTemps, txt.ms(fmt(resultat.ms))],
    [txt.colNoeuds, fmt(resultat.noeuds)],
  ]

  return (
    <figure className="figure figure--large saut">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="saut-commandes">
        <label>
          <span>{txt.motif}</span>
          <select value={id} onChange={(e) => setId(e.target.value)}>
            {MOTIFS_SAUT.map((m) => <option key={m} value={m}>{txt.noms[m]}</option>)}
          </select>
        </label>
        <label className="saut-curseur">
          <span>{txt.generations}</span>
          <input type="range" min="0" max="40" value={k} onChange={(e) => setK(Number(e.target.value))} />
          <output>2<sup>{k}</sup> = {fmt(2 ** k)}</output>
        </label>
        <button className="btn-principal" onClick={calculer} disabled={calcul}>{calcul ? txt.enCours : txt.calculer}</button>
      </div>
      <canvas ref={canvasRef} className="figure-vaste saut-vue" role="img" aria-label={resultat ? txt.resume(txt.noms[resultat.id], fmt(resultat.gen), fmt(resultat.pop)) : txt.attente} data-vide={!resultat} />
      {lignes ? (
        <table className="mesures mesures--serre">
          <tbody>{lignes.map(([a, b]) => <tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}</tbody>
        </table>
      ) : <p className="aide-figure">{txt.attente}</p>}
    </figure>
  )
}

/* ---------- Théorie 6 : le paramètre λ de Langton ---------- */

// La même soupe de 40 × 40 cases pour toutes les règles, au centre d'une grille de 128 × 96
const SOUPE_L = (() => {
  const alea = generateur(3)
  const c = []
  for (let y = 0; y < 40; y++) for (let x = 0; x < 40; x++) if (alea() < 0.4) c.push([x, y, 1])
  return c
})()
const CADRE_L = { x0: 0, y0: 0, x1: 127, y1: 95 }
const FIN_L = (m) => m.gen >= 200
// Les règles à deux états, rangées par λ croissant
const REGLES_L = REGLES.filter((r) => r.regle.etats === 2)
  .map((r) => ({ ...r, l: lambda(r.regle) }))
  .sort((a, b) => a.l.n - b.l.n)

export function FigureLambda({ txt, T, theme }) {
  const [id, setId] = useState('life')
  const choisie = REGLES_L.find((r) => r.id === id)
  const f3 = (v) => v.toLocaleString(T.nombre, { minimumFractionDigits: 3, maximumFractionDigits: 3 })

  return (
    <figure className="figure figure--large">
      <figcaption className="figure-titre">{txt.titre}</figcaption>
      <div className="lambda-corps">
        <ul className="lambda-barres">
          {REGLES_L.map((r) => (
            <li key={r.id}>
              <button aria-pressed={r.id === id} onClick={() => setId(r.id)}>
                <span className="lambda-nom">{T.regles[r.id][0]}<code>{r.texte}</code></span>
                <span className="lambda-barre" aria-hidden="true"><span style={{ width: `${r.l.valeur * 100}%` }} /></span>
                <span className="lambda-valeur">{txt.valeur(r.l.n, f3(r.l.valeur))}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="lambda-vue">
          <MiniVie
            cellules={SOUPE_L}
            W={128}
            H={96}
            regle={choisie.regle}
            boite={CADRE_L}
            vitesse={20}
            fin={FIN_L}
            theme={theme}
            label={txt.label(T.regles[id][0])}
            className="figure-vaste"
          />
          <p className="figure-etat">{txt.etat(T.regles[id][0], choisie.texte)}</p>
        </div>
      </div>
      <p className="aide-figure lambda-legende">{txt.legende}</p>
    </figure>
  )
}

/* ---------- Théorie 7 : des motifs qui se recopient ---------- */

const REPLICATEUR = lireRLE('2b3o$bo2bo$o3bo$o2bo$3o!').cellules // HighLife, 12 cellules
const R_PENTOMINO = motif('rpentomino').cellules
const HIGHLIFE = REGLES.find((r) => r.id === 'highlife').regle
const PARITE = REGLES.find((r) => r.id === 'replicateur').regle
const POS_REPLICATEUR = [30, 30]
const POS_PARITE = [31, 31]
const CADRE_R = { x0: 12, y0: 12, x1: 52, y1: 52 }
const FIN_HIGHLIFE = (m) => m.gen >= 84 // 8 copies : 2^n copies à la génération 12 (2^n − 1)
const FIN_PARITE = (m) => m.gen >= 16   // 8 copies, à 16 cases dans les 8 directions

export function FigureReplicateurs({ txt, theme }) {
  return (
    <figure className="figure figure--large">
      <div className="jumeaux replicateurs">
        <div>
          <MiniVie cellules={REPLICATEUR} W={64} H={64} position={POS_REPLICATEUR} regle={HIGHLIFE} boite={CADRE_R} vitesse={8} fin={FIN_HIGHLIFE} theme={theme} label={txt.titres[0]} />
          <span>{txt.titres[0]}</span>
        </div>
        <div>
          <MiniVie cellules={R_PENTOMINO} W={64} H={64} position={POS_PARITE} regle={PARITE} boite={CADRE_R} vitesse={3} fin={FIN_PARITE} theme={theme} label={txt.titres[1]} />
          <span>{txt.titres[1]}</span>
        </div>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}