import { useEffect, useRef, useState } from 'react'
import { creerMiniLenia, convolutionDirecte, fft2d } from './cpu.js'
import { REGLES, CREATURES } from './bestiaire'
import { grillesNoyaux, preparer } from './modeles'
import { PALETTES } from './moteur'
import Courbes from './Courbes'

// ============================================================
//  FIGURES DE LENIA
//  Calculées sur le processeur, dans un petit monde de 64 × 64 :
//  le mécanisme (état, potentiel, croissance), les voisinages, la
//  robustesse d'un Orbium, la galerie, le banc d'essai Fourier.
// ============================================================

const creature = (id) => CREATURES.find((c) => c.id === id)
const N = 64
const horloge = () => performance.now()

// Peint un champ N × N (valeurs → couleur) dans un canvas, en agrandissant chaque case
function peindre(canvas, champ, n, couleur) {
  if (!canvas) return
  canvas.width = n
  canvas.height = n
  const img = new ImageData(n, n)
  for (let i = 0; i < n * n; i++) {
    const c = couleur(champ[i])
    img.data[i * 4] = c[0]
    img.data[i * 4 + 1] = c[1]
    img.data[i * 4 + 2] = c[2]
    img.data[i * 4 + 3] = 255
  }
  canvas.getContext('2d').putImageData(img, 0, 0)
}
const lenia = (v) => PALETTES.lenia(Math.min(1, Math.max(0, v)))
const croissance = (g) => (g > 0 ? [26 * g, 217 * g, 115 * g] : [217 * -g * 0.6, 51 * -g * 0.6, 153 * -g * 0.6])

function Choix({ options, valeur, onChange, libelle }) {
  return (
    <div className="groupe ln-choix" role="group" aria-label={libelle}>
      {options.map(([id, nom]) => <button key={id} aria-pressed={id === valeur} onClick={() => onChange(id)}>{nom}</button>)}
    </div>
  )
}

/* ---------- Comprendre : état, potentiel, croissance ---------- */

export function FigureMecanisme({ txt, fmt }) {
  const refs = [useRef(null), useRef(null), useRef(null)]
  const [marche, setMarche] = useState(true)
  const [essai, setEssai] = useState(0)
  const [t, setT] = useState(0)
  const marcheRef = useRef(marche)

  useEffect(() => { marcheRef.current = marche }, [marche])

  useEffect(() => {
    const m = creerMiniLenia(N, REGLES.orbium)
    m.poser(creature('orbium').cellules, 0.6)
    m.pas()
    let raf = 0
    let dernier = 0
    const image = (now) => {
      raf = requestAnimationFrame(image)
      if (marcheRef.current && now - dernier > 40) {
        dernier = now
        m.pas()
        setT(m.t)
      }
      peindre(refs[0].current, m.A, N, lenia)
      peindre(refs[1].current, m.U, N, (u) => lenia(u * 3.3))
      peindre(refs[2].current, m.G, N, croissance)
    }
    raf = requestAnimationFrame(image)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [essai])

  return (
    <figure className="figure figure--large">
      <div className="ln-trio">
        {txt.titres.map((titre, k) => (
          <div key={titre}><canvas ref={refs[k]} role="img" aria-label={titre} /><span>{titre}</span></div>
        ))}
      </div>
      <div className="figure-actions">
        <button className="btn" onClick={() => setMarche(!marche)}>{marche ? txt.pause : txt.reprendre}</button>
        <button className="btn" onClick={() => setEssai(essai + 1)}>{txt.recommencer}</button>
        <span className="figure-etat">{txt.temps(fmt(t, { maximumFractionDigits: 1, minimumFractionDigits: 1 }))}</span>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie : du voisinage de Moore au noyau en anneaux ---------- */

const VOISINAGES = {
  vie: null,
  un: [1],
  deux: [1, 1 / 3],
  trois: [1 / 2, 1, 2 / 3],
}
const TV = 41

export function FigureVoisinages({ txt }) {
  const [choix, setChoix] = useState('un')
  const ref = useRef(null)
  useEffect(() => {
    const champ = new Float64Array(TV * TV)
    const c = (TV - 1) / 2
    if (choix === 'vie') {
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) champ[(c + dy) * TV + c + dx] = 1
    } else {
      const k = grillesNoyaux({ modele: 'classique', R: 13, noyaux: [{ b: VOISINAGES[choix], kn: 1 }] }, 64)[0]
      let max = 0
      for (const v of k) max = Math.max(max, v)
      for (let y = 0; y < TV; y++) {
        for (let x = 0; x < TV; x++) {
          const yy = (y - c + 64) % 64
          const xx = (x - c + 64) % 64
          champ[y * TV + x] = k[yy * 64 + xx] / max
        }
      }
    }
    peindre(ref.current, champ, TV, (v) => (v > 0 ? lenia(0.25 + 0.75 * v) : [9, 10, 15]))
  }, [choix])
  return (
    <figure className="figure figure--large">
      <Choix options={Object.keys(VOISINAGES).map((id) => [id, txt.noms[id]])} valeur={choix} onChange={setChoix} libelle={txt.choix} />
      <div className="ln-paire ln-paire--une">
        <div><canvas ref={ref} role="img" aria-label={txt.noms[choix]} /><span>{txt.descriptions[choix]}</span></div>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie : la règle, μ et σ ---------- */

export function FigureRegle({ txt, T, fmt }) {
  const [m, setM] = useState(0.15)
  const [s, setS] = useState(0.015)
  const regle = { ...REGLES.orbium, noyaux: [{ ...REGLES.orbium.noyaux[0], m, s }] }
  return (
    <figure className="figure figure--large">
      <div className="ln-regle">
        <Courbes regle={regle} T={T} fmt={fmt} />
      </div>
      <label className="ln-curseur">
        <span>μ</span>
        <input type="range" min="0.05" max="0.35" step="0.005" value={m} onChange={(e) => setM(Number(e.target.value))} />
        <output>{fmt(m, { maximumFractionDigits: 3 })}</output>
      </label>
      <label className="ln-curseur">
        <span>σ</span>
        <input type="range" min="0.005" max="0.06" step="0.001" value={s} onChange={(e) => setS(Number(e.target.value))} />
        <output>{fmt(s, { maximumFractionDigits: 3 })}</output>
      </label>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Théorie : un Orbium se répare ---------- */

export function FigureRobustesse({ txt, fmt }) {
  const ref = useRef(null)
  const monde = useRef(null)
  const [essai, setEssai] = useState(0)
  const [masse, setMasse] = useState(0)

  useEffect(() => {
    const m = creerMiniLenia(N, REGLES.orbium)
    m.poser(creature('orbium').cellules, 0.3)
    monde.current = m
    let raf = 0
    let dernier = 0
    const image = (now) => {
      raf = requestAnimationFrame(image)
      if (now - dernier > 35) {
        dernier = now
        m.pas()
        setMasse(m.masse())
      }
      peindre(ref.current, m.A, N, lenia)
    }
    raf = requestAnimationFrame(image)
    return () => cancelAnimationFrame(raf)
  }, [essai])

  // Les perturbations portent autour du centre de masse de la créature
  const centre = (m) => {
    const a = (2 * Math.PI) / N
    let cx = 0
    let cxs = 0
    let cy = 0
    let cys = 0
    let s = 0
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const v = m.A[y * N + x]
        cx += v * Math.cos(x * a)
        cxs += v * Math.sin(x * a)
        cy += v * Math.cos(y * a)
        cys += v * Math.sin(y * a)
        s += v
      }
    }
    if (s <= 0) return [N / 2, N / 2]
    return [((Math.atan2(cxs, cx) / a) + N) % N, ((Math.atan2(cys, cy) / a) + N) % N]
  }
  const bousculer = () => {
    const m = monde.current
    if (!m) return
    const [cx, cy] = centre(m)
    for (let y = -12; y <= 12; y++) {
      for (let x = -12; x <= 12; x++) {
        const i = ((Math.round(cy) + y + N) % N) * N + ((Math.round(cx) + x + N) % N)
        m.A[i] = Math.min(1, Math.max(0, m.A[i] + (Math.random() - 0.5) * 0.6))
      }
    }
  }
  const couper = () => {
    const m = monde.current
    if (!m) return
    const [cx, cy] = centre(m)
    for (let y = -14; y <= 14; y++) {
      for (let x = 0; x <= 14; x++) {
        const i = ((Math.round(cy) + y + N) % N) * N + ((Math.round(cx) + x + N) % N)
        m.A[i] = 0
      }
    }
  }
  return (
    <figure className="figure figure--large">
      <canvas ref={ref} className="ln-figure-canvas ln-figure-canvas--petit" role="img" aria-label={txt.label} />
      <div className="figure-actions">
        <button className="btn" onClick={bousculer}>{txt.bousculer}</button>
        <button className="btn" onClick={couper}>{txt.couper}</button>
        <button className="btn" onClick={() => setEssai(essai + 1)}>{txt.recommencer}</button>
        <span className="figure-etat">{txt.masse(fmt(masse, { maximumFractionDigits: 1, minimumFractionDigits: 1 }))}</span>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Comprendre : la galerie ---------- */

const GALERIE = ['orbium', 'scutium', 'gyrorbium', 'hydrogeminium', 'hexadentium', 'asterium', 'limus', 'gyrans', 'planeur']

export function FigureGalerie({ txt, T, onOuvrir }) {
  const refs = useRef([])
  useEffect(() => {
    GALERIE.forEach((id, k) => {
      const canvas = refs.current[k]
      const c = creature(id)
      if (!canvas || !c) return
      const p = preparer(c.cellules, 0, id === 'planeur' || id === 'hexadentium' || id === 'asterium' || id === 'hydrogeminium' ? 1 : 1.6)
      const D = Math.max(p.w, 72)
      const champ = new Float64Array(D * D * 3)
      const o = Math.floor((D - p.w) / 2)
      for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) for (let ch = 0; ch < p.canaux.length; ch++) champ[((y + o) * D + x + o) * 3 + ch] = p.canaux[ch][y * p.w + x]
      canvas.width = D
      canvas.height = D
      const img = new ImageData(D, D)
      for (let i = 0; i < D * D; i++) {
        const rgb = p.canaux.length > 1
          ? [champ[i * 3] * 255, champ[i * 3 + 1] * 255, champ[i * 3 + 2] * 255]
          : champ[i * 3] > 0 ? lenia(champ[i * 3]) : [9, 10, 15]
        img.data.set([rgb[0], rgb[1], rgb[2], 255], i * 4)
      }
      canvas.getContext('2d').putImageData(img, 0, 0)
    })
  }, [])
  return (
    <div className="ln-galerie">
      {GALERIE.map((id, k) => (
        <figure key={id}>
          <canvas ref={(el) => { refs.current[k] = el }} role="img" aria-label={T.creatures[id][0]} />
          <figcaption>
            <strong>{T.creatures[id][0]}</strong>
            <span>{txt.cartes[id]}</span>
            <button className="btn" onClick={() => onOuvrir(id)}>{txt.ouvrir}</button>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------- Calcul : convolution directe contre Fourier ---------- */

function chronos(n) {
  const R = 13
  const A = Float64Array.from({ length: n * n }, () => Math.random())
  const K = grillesNoyaux(REGLES.orbium, n)[0]
  let t0 = horloge()
  convolutionDirecte(A, K, n, R)
  const directe = horloge() - t0
  t0 = horloge()
  const kr = Float64Array.from(K)
  const ki = new Float64Array(n * n)
  fft2d(kr, ki, n)
  const ar = Float64Array.from(A)
  const ai = new Float64Array(n * n)
  fft2d(ar, ai, n)
  for (let i = 0; i < n * n; i++) {
    const r = ar[i] * kr[i] - ai[i] * ki[i]
    ai[i] = ar[i] * ki[i] + ai[i] * kr[i]
    ar[i] = r
  }
  fft2d(ar, ai, n, true)
  const fourier = horloge() - t0
  return { directe, fourier }
}

export function FigureBanc({ txt, fmt }) {
  const [etat, setEtat] = useState(null)
  const mesurer = () => {
    setEtat('calcul')
    setTimeout(() => setEtat([64, 128, 256].map((n) => ({ n, ...chronos(n) }))), 50)
  }
  const ms = (v) => txt.ms(fmt(v, { maximumFractionDigits: v < 10 ? 1 : 0 }))
  return (
    <figure className="figure figure--large">
      <div className="figure-actions">
        <button className="btn-principal" onClick={mesurer} disabled={etat === 'calcul'}>{etat === 'calcul' ? txt.enCours : etat ? txt.encore : txt.bouton}</button>
      </div>
      {Array.isArray(etat) ? (
        <table className="mesures mesures--serre ln-banc">
          <thead><tr><th scope="col">{txt.monde}</th><th scope="col">{txt.directe}</th><th scope="col">{txt.fourier}</th><th scope="col">{txt.rapport}</th></tr></thead>
          <tbody>
            {etat.map((e) => (
              <tr key={e.n}><td>{`${e.n} × ${e.n}`}</td><td>{ms(e.directe)}</td><td>{ms(e.fourier)}</td><td>{`× ${fmt(Math.max(1, Math.round(e.directe / Math.max(e.fourier, 0.01))))}`}</td></tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="aide-figure">{txt.attente}</p>
      )}
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}
