import { PAR_OISEAU } from './hote.js'
import { FOND, COULEUR_SEUL, COULEURS_ESPECES, COULEURS_MENEURS, COULEURS_CAP, COULEURS_PEUR, COULEUR_PREDATEUR } from './rendu2d.js'
import { MAX_OBSTACLES, MAX_PREDATEURS } from './moteur.js'

// ============================================================
//  BOIDS : le dessin en 3D (three.js, chargé seulement si on passe en 3D)
//  Un oiseau = un petit cône orienté selon sa vitesse ; tous les
//  oiseaux forment un seul InstancedMesh (un seul appel de dessin,
//  même pour 5 000 oiseaux). Les obstacles sont des colonnes.
//  Repère : le moteur a z vers le haut ; three.js a y vers le haut.
//  On envoie donc (x, y, z) du moteur vers (x, z, y) de la scène.
//  La caméra tourne doucement autour de la nuée (on peut la prendre
//  à la souris : glisser pour tourner, molette pour s'approcher).
// ============================================================

export async function creerRendu3D(canvas) {
  const THREE = await import('three')
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(FOND)
  scene.fog = new THREE.Fog(FOND, 10, 100)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 10000)
  const controles = new OrbitControls(camera, canvas)
  controles.enableDamping = true
  controles.autoRotate = true
  controles.autoRotateSpeed = 0.5

  scene.add(new THREE.HemisphereLight(0xe4ebf7, 0x1b1f29, 1.7))
  const soleil = new THREE.DirectionalLight(0xffffff, 1.6)
  soleil.position.set(1, 2, 1.4)
  scene.add(soleil)

  // Les palettes, en couleurs linéaires (ce qu'attend instanceColor)
  const lineaire = (css) => { const c = new THREE.Color(css); return [c.r, c.g, c.b] }
  const P = {
    seul: [lineaire(COULEUR_SEUL)],
    especes: COULEURS_ESPECES.map(lineaire),
    meneurs: COULEURS_MENEURS.map(lineaire),
    cap: COULEURS_CAP.map(lineaire),
    peur: COULEURS_PEUR.map(lineaire),
  }

  const cone = new THREE.ConeGeometry(0.16, 0.55, 6)  // pointe vers +y
  const matiere = new THREE.MeshLambertMaterial({ color: 0xffffff })
  let oiseaux = null
  let capacite = 0
  function assurer(N) {
    if (N <= capacite) return
    if (oiseaux) { scene.remove(oiseaux); oiseaux.dispose() }
    capacite = Math.ceil(N / 1024) * 1024
    oiseaux = new THREE.InstancedMesh(cone, matiere, capacite)
    oiseaux.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    oiseaux.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacite * 3), 3)
    oiseaux.instanceColor.setUsage(THREE.DynamicDrawUsage)
    oiseaux.frustumCulled = false
    scene.add(oiseaux)
  }

  const cadreBoite = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
    new THREE.LineBasicMaterial({ color: 0x3a4152 }),
  )
  scene.add(cadreBoite)

  const colonnes = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(1, 1, 1, 24),
    new THREE.MeshLambertMaterial({ color: 0x2c323e }),
    MAX_OBSTACLES,
  )
  colonnes.count = 0
  colonnes.frustumCulled = false
  scene.add(colonnes)

  const predateurs = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.42, 1.3, 6),
    new THREE.MeshLambertMaterial({ color: new THREE.Color(COULEUR_PREDATEUR), emissive: 0x401010 }),
    MAX_PREDATEURS,
  )
  predateurs.count = 0
  predateurs.frustumCulled = false
  scene.add(predateurs)

  let cle = ''
  let distanceAuto = 1   // distance de cadrage automatique, lissée (monde ouvert)
  const centre = new THREE.Vector3()
  const m4 = new THREE.Matrix4()

  function redimensionner() {
    const w = Math.max(1, canvas.clientWidth)
    const h = Math.max(1, canvas.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  // Écrit la matrice « cône pointé selon d, à l'échelle k, en (x, y, z) » (repère de la scène)
  function poser(a, o, x, y, z, dx, dy, dz, k) {
    const n = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
    dx /= n; dy /= n; dz /= n
    // e1 ⟂ d : produit vectoriel avec un axe qui n'est pas parallèle à d
    let ex, ey, ez
    if (Math.abs(dy) < 0.95) { ex = dz; ey = 0; ez = -dx } else { ex = 0; ey = -dz; ez = dy }
    const ne = Math.sqrt(ex * ex + ey * ey + ez * ez) || 1
    ex /= ne; ey /= ne; ez /= ne
    // e3 = e1 × d
    const fx = ey * dz - ez * dy, fy = ez * dx - ex * dz, fz = ex * dy - ey * dx
    a[o] = ex * k; a[o + 1] = ey * k; a[o + 2] = ez * k; a[o + 3] = 0
    a[o + 4] = dx * k; a[o + 5] = dy * k; a[o + 6] = dz * k; a[o + 7] = 0
    a[o + 8] = fx * k; a[o + 9] = fy * k; a[o + 10] = fz * k; a[o + 11] = 0
    a[o + 12] = x; a[o + 13] = y; a[o + 14] = z; a[o + 15] = 1
  }

  /**
   * @param img  image reçue du simulateur (monde en 3D)
   * @param o    { vue, especes }
   */
  function dessiner(img, o = {}) {
    const b = img.boite
    const taille = Math.max(b[3] - b[0], b[4] - b[1], b[5] - b[2], 1)
    const cx = (b[0] + b[3]) / 2, cy = (b[1] + b[4]) / 2, cz = (b[2] + b[5]) / 2
    const ouvert = img.bords === 'ouvert'

    // Nouveau monde : on recadre la caméra
    const nouvelle = `${img.modele}|${img.bords}|${ouvert ? 0 : img.L.toFixed(2)}`
    if (nouvelle !== cle) {
      cle = nouvelle
      centre.set(ouvert ? cx : img.L / 2, ouvert ? cz : img.L / 2, ouvert ? cy : img.L / 2)
      const d = taille * 1.9
      distanceAuto = d
      controles.target.copy(centre)
      camera.position.set(centre.x + d * 0.75, centre.y + d * 0.45, centre.z + d * 0.75)
      controles.update()
    }
    if (ouvert) {
      // le groupe se déplace : la caméra le suit
      const avant = controles.target.clone()
      controles.target.lerp(new THREE.Vector3(cx, cz, cy), 0.08)
      camera.position.add(controles.target.clone().sub(avant))
      // et recule ou avance avec sa taille, en gardant le zoom choisi à la souris
      const vise = camera.position.clone().sub(controles.target)
      const rapport = vise.length() / distanceAuto
      distanceAuto += (taille * 1.9 - distanceAuto) * 0.05
      camera.position.copy(controles.target).add(vise.setLength(rapport * distanceAuto))
    }
    const distance = camera.position.distanceTo(controles.target)
    scene.fog.near = distance * 0.6
    scene.fog.far = distance * 2.4

    cadreBoite.visible = !ouvert
    if (!ouvert) {
      cadreBoite.scale.set(img.L, img.L, img.L)
      cadreBoite.position.set(img.L / 2, img.L / 2, img.L / 2)
      cadreBoite.material.color.set(img.bords === 'murs' ? 0x59627a : 0x2c3240)
    }

    // Oiseaux
    const { N, etat } = img
    assurer(N)
    oiseaux.count = N
    const a = oiseaux.instanceMatrix.array
    const col = oiseaux.instanceColor.array
    const k = img.modele === 'couzin' ? 1.6 : img.modele === 'cucker' ? taille / 45 : 1
    const vue = o.vue ?? 'especes'
    const pal = vue === 'cap' ? P.cap : vue === 'peur' ? P.peur : img.modele === 'couzin' ? P.meneurs : (o.especes ?? 1) > 1 ? P.especes : P.seul
    for (let i = 0; i < N; i++) {
      const e = PAR_OISEAU * i
      poser(a, 16 * i, etat[e], etat[e + 2], etat[e + 1], etat[e + 3], etat[e + 5], etat[e + 4], k)
      let c
      if (vue === 'cap') {
        const ang = Math.atan2(etat[e + 4], etat[e + 3])
        c = Math.floor(((ang / (2 * Math.PI) + 1) % 1) * pal.length) % pal.length
      } else if (vue === 'peur') {
        const p = etat[e + 7]
        c = p < 0.05 ? 0 : Math.min(4, 1 + Math.floor(p * 4))
      } else {
        const q = etat[e + 6]
        c = img.modele === 'couzin' ? (q >= 3 ? q - 2 : 0) : Math.min(pal.length - 1, q)
      }
      const rgb = pal[c]
      col[3 * i] = rgb[0]; col[3 * i + 1] = rgb[1]; col[3 * i + 2] = rgb[2]
    }
    oiseaux.instanceMatrix.needsUpdate = true
    oiseaux.instanceColor.needsUpdate = true

    // Colonnes (les obstacles du sol, sur toute la hauteur du monde)
    const nO = img.obstacles.length / 3
    colonnes.count = nO
    for (let q = 0; q < nO; q++) {
      const r = img.obstacles[3 * q + 2]
      m4.makeScale(r, img.L, r)
      m4.setPosition(img.obstacles[3 * q], img.L / 2, img.obstacles[3 * q + 1])
      colonnes.setMatrixAt(q, m4)
    }
    colonnes.instanceMatrix.needsUpdate = true

    // Prédateurs
    const nP = img.pred.length / 6
    predateurs.count = nP
    const ap = predateurs.instanceMatrix.array
    for (let q = 0; q < nP; q++) {
      const p = img.pred
      poser(ap, 16 * q, p[6 * q], p[6 * q + 2], p[6 * q + 1], p[6 * q + 3], p[6 * q + 5], p[6 * q + 4], 1)
    }
    predateurs.instanceMatrix.needsUpdate = true

    controles.update()
    renderer.render(scene, camera)
  }

  function liberer() {
    controles.dispose()
    if (oiseaux) oiseaux.dispose()
    cone.dispose()
    matiere.dispose()
    colonnes.geometry.dispose(); colonnes.material.dispose(); colonnes.dispose()
    predateurs.geometry.dispose(); predateurs.material.dispose(); predateurs.dispose()
    cadreBoite.geometry.dispose(); cadreBoite.material.dispose()
    renderer.dispose()
  }

  // Le cadrage automatique tourne-t-il encore ?
  const tourner = (oui) => { controles.autoRotate = oui }

  return { dessiner, redimensionner, liberer, tourner }
}
