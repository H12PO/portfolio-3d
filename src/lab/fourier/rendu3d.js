import { chaine } from './moteur.js'
import { FOND } from './rendu2d.js'

// ============================================================
//  ÉPICYCLES DE FOURIER : le dessin en 3D (three.js, chargé seulement
//  si on passe en 3D)
//  Le temps devient la profondeur : la pointe laisse derrière elle un
//  ressort, la courbe déroulée dans le temps sur un tour complet. Vue de
//  face, le ressort redonne la forme ; vue de côté, chaque coordonnée
//  devient une onde. Les cercles tournent dans le plan du présent.
//  Repère : le moteur a x vers la droite et y vers le bas ; la scène a
//  y vers le haut. Un point (x, y) au temps t va en (x, −y, −P·(âge)).
// ============================================================

const PROFONDEUR = 3.2      // longueur du ressort (un tour complet)
const MAX_CERCLES_3D = 400

export async function creerRendu3D(canvas) {
  const THREE = await import('three')
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(FOND)
  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100)
  camera.position.set(2.6, 1.2, 2.4)
  const controles = new OrbitControls(camera, canvas)
  controles.enableDamping = true
  controles.autoRotate = true
  controles.autoRotateSpeed = 0.6
  controles.target.set(0, 0, -PROFONDEUR / 2)

  // le ressort : la courbe sur un tour, du présent (z = 0) au passé (z = −P)
  const N_RESSORT = 2048
  const posRessort = new Float32Array(N_RESSORT * 3)
  const colRessort = new Float32Array(N_RESSORT * 3)
  const geoRessort = new THREE.BufferGeometry()
  geoRessort.setAttribute('position', new THREE.BufferAttribute(posRessort, 3))
  geoRessort.setAttribute('color', new THREE.BufferAttribute(colRessort, 3))
  const ressort = new THREE.Line(geoRessort, new THREE.LineBasicMaterial({ vertexColors: true }))
  scene.add(ressort)

  // la forme d'origine, posée dans le plan du présent
  const geoOrigine = new THREE.BufferGeometry()
  const origine = new THREE.LineLoop(geoOrigine, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 }))
  scene.add(origine)
  let cleOrigine = null

  // les cercles et leurs rayons (une seule géométrie de segments)
  const SEG = 48
  const posCercles = new Float32Array(MAX_CERCLES_3D * SEG * 2 * 3)
  const geoCercles = new THREE.BufferGeometry()
  geoCercles.setAttribute('position', new THREE.BufferAttribute(posCercles, 3))
  const cercles = new THREE.LineSegments(geoCercles, new THREE.LineBasicMaterial({ color: 0x8caadc, transparent: true, opacity: 0.4 }))
  scene.add(cercles)
  const posRayons = new Float32Array((MAX_CERCLES_3D + 1) * 3)
  const geoRayons = new THREE.BufferGeometry()
  geoRayons.setAttribute('position', new THREE.BufferAttribute(posRayons, 3))
  const rayons = new THREE.Line(geoRayons, new THREE.LineBasicMaterial({ color: 0xd6e2f8 }))
  scene.add(rayons)
  const pointe = new THREE.Mesh(new THREE.SphereGeometry(0.025, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }))
  scene.add(pointe)

  // un axe du temps, discret
  const axe = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0.2), new THREE.Vector3(0, 0, -PROFONDEUR - 0.2)]),
    new THREE.LineBasicMaterial({ color: 0x3a4152 }),
  )
  scene.add(axe)

  let tampon = null
  const chaud = new THREE.Color(0xffb347), froid = new THREE.Color(0x3a2a14)
  const c = new THREE.Color()

  function redimensionner() {
    const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  /** @param scene2 la même scène que pour la 2D : { origine, approx, t, fermee, options } */
  function dessiner(sc) {
    const ap = sc.approx
    const o = { cercles: true, origine: true, ...(sc.options ?? {}) }
    // forme d'origine (reconstruite seulement si elle change)
    if (sc.origine && sc.origine !== cleOrigine) {
      cleOrigine = sc.origine
      const { x, y } = sc.origine
      const pts = new Float32Array(x.length * 3)
      for (let i = 0; i < x.length; i++) { pts[3 * i] = x[i]; pts[3 * i + 1] = -y[i]; pts[3 * i + 2] = 0 }
      geoOrigine.setAttribute('position', new THREE.BufferAttribute(pts, 3))
      geoOrigine.computeBoundingSphere()
    }
    origine.visible = !!sc.origine && o.origine

    if (ap) {
      const { x, y } = ap.courbe
      const N = x.length
      const t = sc.t ?? 0
      // le ressort : pour chaque âge a ∈ [0, 1), le point de la courbe au temps t − a
      for (let i = 0; i < N_RESSORT; i++) {
        const a = i / (N_RESSORT - 1)
        const u = (((t - a) % 1) + 1) % 1
        const f = u * N, j = Math.floor(f) % N, j1 = (j + 1) % N, w = f - Math.floor(f)
        posRessort[3 * i] = x[j] * (1 - w) + x[j1] * w
        posRessort[3 * i + 1] = -(y[j] * (1 - w) + y[j1] * w)
        posRessort[3 * i + 2] = -a * PROFONDEUR
        c.copy(chaud).lerp(froid, a * 0.85)
        colRessort[3 * i] = c.r; colRessort[3 * i + 1] = c.g; colRessort[3 * i + 2] = c.b
      }
      geoRessort.attributes.position.needsUpdate = true
      geoRessort.attributes.color.needsUpdate = true
      geoRessort.computeBoundingSphere()

      // la chaîne des cercles au présent
      tampon = chaine(ap, t, tampon)
      const n = Math.min(ap.cercles.length, MAX_CERCLES_3D)
      let p = 0
      for (let q = 0; q < n && o.cercles; q++) {
        const r = ap.cercles[q].r
        if (r < 0.002) break
        const cx = tampon[2 * q], cy = -tampon[2 * q + 1]
        for (let s = 0; s < SEG; s++) {
          const a0 = (s / SEG) * 2 * Math.PI, a1 = ((s + 1) / SEG) * 2 * Math.PI
          posCercles[p++] = cx + r * Math.cos(a0); posCercles[p++] = cy + r * Math.sin(a0); posCercles[p++] = 0
          posCercles[p++] = cx + r * Math.cos(a1); posCercles[p++] = cy + r * Math.sin(a1); posCercles[p++] = 0
        }
      }
      geoCercles.setDrawRange(0, p / 3)
      geoCercles.attributes.position.needsUpdate = true
      geoCercles.computeBoundingSphere()
      const nr = o.cercles ? Math.min(ap.cercles.length, MAX_CERCLES_3D) : 0
      for (let q = 0; q <= nr; q++) { posRayons[3 * q] = tampon[2 * q]; posRayons[3 * q + 1] = -tampon[2 * q + 1]; posRayons[3 * q + 2] = 0 }
      geoRayons.setDrawRange(0, nr + 1)
      geoRayons.attributes.position.needsUpdate = true
      geoRayons.computeBoundingSphere()
      const nn = ap.cercles.length
      pointe.position.set(tampon[2 * nn], -tampon[2 * nn + 1], 0)
    }
    ressort.visible = !!ap
    controles.update()
    renderer.render(scene, camera)
  }

  function liberer() {
    controles.dispose()
    for (const objet of [ressort, origine, cercles, rayons, pointe, axe]) { objet.geometry.dispose(); objet.material.dispose() }
    renderer.dispose()
  }

  const tourner = (oui) => { controles.autoRotate = oui }

  return { redimensionner, dessiner, liberer, tourner }
}
