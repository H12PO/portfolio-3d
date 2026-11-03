import { useEffect, useId, useRef, useState } from 'react'
import { creerRendu, THEMES } from './rendu'
import { creerPorte, PORTE, PROGRAMMES, etatInitial, executer } from './calcul.js'

// ============================================================
//  FIGURES DE L'ONGLET CALCUL
//  La porte NON tourne sur le vrai moteur ; la machine à deux
//  compteurs est une maquette, avec les salves de la mémoire à
//  bloc glissant de Dean Hickerson en guise de légende.
// ============================================================

/* ---------- Une porte NON en planeurs ---------- */

const VITESSE_PORTE = 40 // générations par seconde : un créneau toutes les trois quarts de seconde
const BITS_DEPART = [1, 0, 1, 1, 0, 0, 1, 0]

// Repères écrits sur la grille, après le rendu : textes, case de lecture
function annoter(canvas, camera, theme, txt) {
  const ctx = canvas.getContext('2d')
  const th = THEMES[theme]
  const e = Math.min(window.devicePixelRatio || 1, 2)
  const z = camera.zoom
  const versEcran = (x, y) => [canvas.width / 2 + (x - camera.x) * z, canvas.height / 2 + (y - camera.y) * z]

  // La sonde : 5 × 5 cases où l'on lit la sortie
  const [sx, sy] = PORTE.sonde
  const [px, py] = versEcran(sx - 2, sy - 2)
  ctx.strokeStyle = th.sig
  ctx.lineWidth = 1.5 * e
  ctx.setLineDash([4 * e, 3 * e])
  ctx.strokeRect(px, py, 5 * z, 5 * z)
  ctx.setLineDash([])

  ctx.font = `500 ${12 * e}px "IBM Plex Sans", system-ui, sans-serif`
  ctx.fillStyle = th.encre
  ctx.globalAlpha = 0.78
  ctx.textBaseline = 'alphabetic'
  const [cx, cy] = PORTE.canon
  const [ax, ay] = PORTE.entree
  const [mx, my] = PORTE.mangeur
  for (const [texte, x, y] of [
    [txt.canon, cx, cy - 1.2],
    [txt.signal, ax, ay - 1.2],
    [txt.sortie, sx + 4, sy + 1],
    [txt.mangeur, mx + 6, my + 3],
  ]) {
    const [tx, ty] = versEcran(x, y)
    ctx.fillText(texte, tx, ty)
  }
  ctx.globalAlpha = 1
}

export function FigurePorte({ txt, theme }) {
  const canvasRef = useRef(null)
  const ident = useId()
  const [bits, setBits] = useState(BITS_DEPART)
  const bitsRef = useRef(bits)
  const [lus, setLus] = useState(() => Array(8).fill(null)) // dernière lecture de chaque position : { entree, sortie }
  const [dernier, setDernier] = useState(-1)

  // La boucle de simulation lit les bits par une référence, sans redémarrer
  useEffect(() => {
    bitsRef.current = bits
  }, [bits])

  useEffect(() => {
    const canvas = canvasRef.current
    const e = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(canvas.clientWidth * e)
    canvas.height = Math.round(canvas.clientHeight * e)

    const porte = creerPorte()
    const rendu = creerRendu(canvas, porte.monde)
    rendu.recentrer(PORTE.vue)

    let visible = true
    const obs = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    obs.observe(canvas)

    let raf = 0
    let dernierT = performance.now()
    let accumule = 0
    const image = (t) => {
      raf = requestAnimationFrame(image)
      const dt = Math.min(100, t - dernierT)
      dernierT = t
      if (!visible) return
      accumule += (dt * VITESSE_PORTE) / 1000
      while (accumule >= 1) {
        accumule -= 1
        const lu = porte.pas((k) => bitsRef.current[k % 8])
        if (lu) {
          const i = lu.k % 8
          setLus((l) => l.map((v, j) => (j === i ? { entree: lu.entree, sortie: lu.sortie } : v)))
          setDernier(i)
        }
      }
      rendu.dessiner({ effets: { quadrillage: true, age: true, trainees: true }, theme })
      annoter(canvas, rendu.camera, theme, txt.reperes)
    }
    raf = requestAnimationFrame(image)
    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [theme, txt])

  const basculer = (i) => setBits((b) => b.map((v, j) => (j === i ? 1 - v : v)))

  return (
    <figure className="figure figure--large">
      <canvas ref={canvasRef} className="figure-vaste porte-vue" role="img" aria-label={txt.label} />
      <div className="porte-bits">
        <div className="porte-ligne">
          <span id={ident}>{txt.entree}</span>
          <div className="porte-cases" role="group" aria-labelledby={ident}>
            {bits.map((b, i) => (
              <button key={i} aria-pressed={!!b} aria-label={txt.bit(i + 1, b)} onClick={() => basculer(i)}>{b}</button>
            ))}
          </div>
        </div>
        <div className="porte-ligne">
          <span>{txt.lue}</span>
          <div className="porte-cases">
            {lus.map((l, i) => {
              const aJour = l && l.entree === bits[i]
              return (
                <output key={i} data-lu={i === dernier} data-attente={!aJour} aria-label={aJour ? txt.bitLu(i + 1, l.sortie) : txt.attente}>
                  {aJour ? l.sortie : '·'}
                </output>
              )
            })}
          </div>
        </div>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}

/* ---------- Une machine à deux compteurs ---------- */

const RAIL = 11        // positions 0 à 10 du bloc sur son rail
const CADENCE = 650    // ms entre deux instructions en marche automatique
const MAX_A = { doubler: 5, parite: 10 }

export function FigureMinsky({ txt }) {
  const [id, setId] = useState('doubler')
  const [depart, setDepart] = useState(PROGRAMMES.doubler.depart.A)
  const [etat, setEtat] = useState(() => etatInitial(PROGRAMMES.doubler.depart.A))
  const [marche, setMarche] = useState(false)
  const prog = PROGRAMMES[id]
  const enMarche = marche && !etat.fin

  useEffect(() => {
    if (!enMarche) return
    const minuterie = setInterval(() => setEtat((e) => executer(e, PROGRAMMES[id])), CADENCE)
    return () => clearInterval(minuterie)
  }, [enMarche, id])

  const recommencer = (a = depart) => {
    setMarche(false)
    setEtat(etatInitial(a))
  }
  const choisir = (nouveau) => {
    setId(nouveau)
    setDepart(PROGRAMMES[nouveau].depart.A)
    setMarche(false)
    setEtat(etatInitial(PROGRAMMES[nouveau].depart.A))
  }
  const changerDepart = (d) => {
    const a = Math.max(0, Math.min(MAX_A[id], depart + d))
    setDepart(a)
    recommencer(a)
  }

  return (
    <figure className="figure figure--large minsky">
      <div className="saut-commandes">
        <label>
          <span>{txt.programme}</span>
          <select value={id} onChange={(e) => choisir(e.target.value)}>
            {Object.keys(PROGRAMMES).map((p) => <option key={p} value={p}>{txt.noms[p]}</option>)}
          </select>
        </label>
        <div className="minsky-depart">
          <span>{txt.depart}</span>
          <div>
            <button className="btn btn-icone" onClick={() => changerDepart(-1)} disabled={depart === 0} aria-label={txt.moins}>−</button>
            <output>A = {depart}</output>
            <button className="btn btn-icone" onClick={() => changerDepart(1)} disabled={depart === MAX_A[id]} aria-label={txt.plus}>+</button>
          </div>
        </div>
      </div>

      <div className="minsky-corps">
        <div className="minsky-registres">
          {['A', 'B'].map((r) => (
            <div key={r} className="minsky-registre">
              <span>{r}</span>
              <div className="minsky-rail" role="img" aria-label={txt.rail(r, etat[r])}>
                {Array.from({ length: RAIL }, (_, k) => <span key={k} data-bloc={k === etat[r]} />)}
              </div>
              <output>{etat[r]}</output>
            </div>
          ))}
          <p className="figure-etat minsky-action" aria-live="polite">{txt.action(etat, id, depart)}</p>
        </div>
        <ol className="minsky-code" aria-label={txt.code}>
          {prog.code.map((ins, k) => (
            <li key={k} aria-current={!etat.fin && etat.pc === k ? 'true' : undefined}>
              <b>q{k + 1}</b>{txt.instruction(ins)}
            </li>
          ))}
        </ol>
      </div>

      <div className="figure-actions">
        <button className="btn" onClick={() => setEtat((e) => executer(e, prog))} disabled={!!etat.fin || enMarche}>{txt.unPas}</button>
        <button className="btn" onClick={() => setMarche((m) => !m)} disabled={!!etat.fin}>{enMarche ? txt.pause : txt.lancer}</button>
        <button className="btn" onClick={() => recommencer()}>{txt.recommencer}</button>
      </div>
      <figcaption><p>{txt.legende}</p></figcaption>
    </figure>
  )
}