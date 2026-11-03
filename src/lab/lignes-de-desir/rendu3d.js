import { SOL, MAX_MARCHEURS, MAX_FOURMIS } from './moteur.js'
import { FOND, COULEURS_TYPES, COULEUR_MARCHEUR, creerPeintre } from './rendu2d.js'

// ============================================================
//  LIGNES DE DÉSIR : le dessin en 3D (three.js, chargé seulement si
//  on passe en 3D)
//  Le sol est un plan texturé par la même petite image que la 2D
//  (usure ou phéromones). Dessus : des touffes d'herbe qui se couchent
//  là où l'on marche, les bâtiments, les clôtures, les arbres, et les
//  marcheurs. Tout ce qui se répète est un InstancedMesh (un seul appel
//  de dessin par sorte d'objet).
//  Repère : le moteur a x vers la droite et y vers le bas ; la scène a
//  x vers la droite, y vers le haut et z vers le spectateur. Un point
//  (x, y) du moteur va en (x, 0, y) dans la scène.
// ============================================================

const HAUTEURS = { herbe: 7, sol: 3.2, sable: 1.2 }   // hauteur des bâtiments (ou des murs, des cailloux)
const PAS_TOUFFE = 0.9                                 // m entre deux touffes d'herbe

export async function creerRendu3D(canvas) {
  const THREE = await import('three')
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js')

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(FOND)
  scene.fog = new THREE.Fog(FOND, 60, 260)
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 2000)
  const controles = new OrbitControls(camera, canvas)
  controles.enableDamping = true
  controles.autoRotate = true
  controles.autoRotateSpeed = 0.35
  controles.maxPolarAngle = Math.PI * 0.47

  scene.add(new THREE.HemisphereLight(0xeef2ff, 0x2a2418, 1.6))
  const soleil = new THREE.DirectionalLight(0xfff4e0, 1.7)
  soleil.position.set(-0.6, 1.4, 0.8)
  scene.add(soleil)

  const peintre = creerPeintre()
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const haut = new THREE.Vector3(0, 1, 0)
  const pos = new THREE.Vector3()
  const ech = new THREE.Vector3()
  const couleur = new THREE.Color()

  // Le sol
  const texture = new THREE.CanvasTexture(document.createElement('canvas'))
  const matSol = new THREE.MeshLambertMaterial({ map: texture })
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), matSol)
  plan.rotation.x = -Math.PI / 2
  scene.add(plan)

  // Ce qui dépend du terrain : reconstruit quand le sol change
  let decor = new THREE.Group()
  scene.add(decor)
  let touffes = null
  let indexTouffes = null     // la case de chaque touffe
  let cle = ''
  let cleCamera = ''

  function construire(img, sol, arbres) {
    scene.remove(decor)
    decor.traverse((o) => { o.geometry?.dispose(); if (o.material && !o.material.partage) o.material.dispose?.() })
    decor = new THREE.Group()
    scene.add(decor)
    const { W, H, h } = img
    const hb = HAUTEURS[img.fond] ?? 6

    // bâtiments et clôtures : une boîte par case
    const compter = (type) => { let n = 0; for (let k = 0; k < W * H; k++) if (sol[k] === type) n++; return n }
    const boites = (type, hauteur, teinte) => {
      const n = compter(type)
      if (!n) return
      const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(h, 1, h), new THREE.MeshLambertMaterial({ color: teinte }), n)
      let q2 = 0
      for (let k = 0; k < W * H; k++) {
        if (sol[k] !== type) continue
        const i = k % W, j = (k - i) / W
        m4.makeScale(1, hauteur, 1)
        m4.setPosition((i + 0.5) * h, hauteur / 2, (j + 0.5) * h)
        mesh.setMatrixAt(q2++, m4)
      }
      decor.add(mesh)
    }
    boites(SOL.BATI, hb, img.fond === 'sable' ? 0x3a332b : 0x343a4a)
    boites(SOL.CLOTURE, img.fond === 'sable' ? 0.5 : 1.1, 0xd9cfb4)

    // arbres : un tronc et un houppier
    if (arbres.length && img.fond !== 'sable') {
      const troncs = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.25, 1, 6), new THREE.MeshLambertMaterial({ color: 0x5a4632 }), arbres.length)
      const feuillages = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshLambertMaterial({ color: 0x2f5a32, flatShading: true }), arbres.length)
      arbres.forEach(([x, y, r], k) => {
        const ht = 2.5 + r
        m4.makeScale(1, ht, 1); m4.setPosition(x, ht / 2, y); troncs.setMatrixAt(k, m4)
        const R = Math.max(1.8, r * 2.4)
        m4.makeScale(R, R * 0.9, R); m4.setPosition(x, ht + R * 0.5, y); feuillages.setMatrixAt(k, m4)
      })
      decor.add(troncs, feuillages)
    }

    // touffes d'herbe, sur une grille un peu bousculée
    touffes = null
    if (img.fond === 'herbe') {
      const liste = []
      for (let y = PAS_TOUFFE / 2; y < H * h; y += PAS_TOUFFE) {
        for (let x = PAS_TOUFFE / 2; x < W * h; x += PAS_TOUFFE) {
          const k0 = Math.floor(y / h) * W + Math.floor(x / h)
          const jx = x + (Math.sin(k0 * 12.9898) * 43758.5453 % 1) * PAS_TOUFFE * 0.4
          const jy = y + (Math.sin(k0 * 78.233) * 43758.5453 % 1) * PAS_TOUFFE * 0.4
          const k = Math.floor(jy / h) * W + Math.floor(jx / h)
          if (sol[k] === SOL.HERBE) liste.push([jx, jy, k])
        }
      }
      touffes = new THREE.InstancedMesh(new THREE.ConeGeometry(0.16, 1, 4), new THREE.MeshLambertMaterial({ color: 0xffffff }), liste.length)
      indexTouffes = liste
      touffes.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      decor.add(touffes)
    }

    // le plan du sol
    plan.scale.set(W * h, H * h, 1)
    plan.position.set((W * h) / 2, 0, (H * h) / 2)
  }

  // Agents
  const capsule = new THREE.CapsuleGeometry(0.22, 1.1, 3, 8)
  const marcheurs = new THREE.InstancedMesh(capsule, new THREE.MeshLambertMaterial({ color: 0xffffff }), MAX_MARCHEURS)
  marcheurs.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_MARCHEURS * 3), 3)
  marcheurs.count = 0
  marcheurs.frustumCulled = false
  scene.add(marcheurs)
  const fourmis = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 0.08, 0.1), new THREE.MeshLambertMaterial({ color: 0xffffff }), MAX_FOURMIS)
  fourmis.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_FOURMIS * 3), 3)
  fourmis.count = 0
  fourmis.frustumCulled = false
  scene.add(fourmis)

  // Portes : des bornes lumineuses
  const bornes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.35, 0.35, 1, 12), new THREE.MeshLambertMaterial({ color: 0xffd84a, emissive: 0x403000 }), 32)
  bornes.count = 0
  bornes.frustumCulled = false
  scene.add(bornes)

  function redimensionner() {
    const w = Math.max(1, canvas.clientWidth)
    const h = Math.max(1, canvas.clientHeight)
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  let image = 0
  function dessiner(img, o = {}) {
    const petit = peintre.peindre(img)
    if (!petit) return
    const sol = peintre.sol
    const { W, H, h } = img
    const nouvelle = `${img.version}|${W}|${H}|${img.fond}`
    if (nouvelle !== cle) {
      cle = nouvelle
      construire(img, sol, peintre.arbres)
      texture.image = petit
      texture.colorSpace = THREE.SRGBColorSpace
      texture.magFilter = THREE.LinearFilter
    }
    texture.needsUpdate = true

    // caméra : recadrée quand on change de terrain (pas quand on le retouche)
    const cc = `${W}|${H}|${h}`
    if (cc !== cleCamera) {
      cleCamera = cc
      const L = Math.max(W, H) * h
      controles.target.set((W * h) / 2, 0, (H * h) / 2)
      camera.position.set((W * h) / 2 - L * 0.15, L * 0.62, (H * h) / 2 + L * 0.78)
      camera.near = L * 0.002
      camera.far = L * 8
      camera.updateProjectionMatrix()
      scene.fog.near = L * 1.1
      scene.fog.far = L * 3.5
      controles.update()
    }

    // l'herbe se couche là où l'on marche (mise à jour une image sur quatre)
    if (touffes && image++ % 4 === 0) {
      for (let q2 = 0; q2 < indexTouffes.length; q2++) {
        const [x, y, k] = indexTouffes[q2]
        const u = img.champ[k] / 255
        const ht = 0.32 * (1 - u) * (1 - u) + 0.02
        m4.makeScale(1 - u * 0.5, ht, 1 - u * 0.5)
        m4.setPosition(x, ht / 2, y)
        touffes.setMatrixAt(q2, m4)
        couleur.setRGB(0.18 + u * 0.4, 0.36 + u * 0.12, 0.16 + u * 0.12, THREE.SRGBColorSpace)
        touffes.setColorAt(q2, couleur)
      }
      touffes.instanceMatrix.needsUpdate = true
      if (touffes.instanceColor) touffes.instanceColor.needsUpdate = true
    }

    // marcheurs ou fourmis
    const A = img.agents
    if (img.modele === 'fourmis') {
      marcheurs.count = 0
      fourmis.count = img.na
      for (let i = 0; i < img.na; i++) {
        q.setFromAxisAngle(haut, -A[4 * i + 3])
        pos.set(A[4 * i], 0.05, A[4 * i + 1])
        ech.set(1, 1, 1)
        m4.compose(pos, q, ech)
        fourmis.setMatrixAt(i, m4)
        couleur.set(A[4 * i + 2] ? '#ffb347' : '#2a1610')
        fourmis.setColorAt(i, couleur)
      }
      fourmis.instanceMatrix.needsUpdate = true
      fourmis.instanceColor.needsUpdate = true
    } else {
      fourmis.count = 0
      marcheurs.count = img.na
      const parType = o.vue === 'types'
      for (let i = 0; i < img.na; i++) {
        m4.makeTranslation(A[4 * i], 0.77, A[4 * i + 1])
        marcheurs.setMatrixAt(i, m4)
        couleur.set(parType ? COULEURS_TYPES[A[4 * i + 2]] : COULEUR_MARCHEUR)
        marcheurs.setColorAt(i, couleur)
      }
      marcheurs.instanceMatrix.needsUpdate = true
      marcheurs.instanceColor.needsUpdate = true
    }

    // portes
    bornes.count = Math.min(32, img.portes.length)
    const hp = img.fond === 'sable' ? 0.6 : 2.4
    for (let k = 0; k < bornes.count; k++) {
      const po = img.portes[k]
      m4.makeScale(img.fond === 'sable' ? 0.6 : 1, hp, img.fond === 'sable' ? 0.6 : 1)
      m4.setPosition(po.x, hp / 2, po.y)
      bornes.setMatrixAt(k, m4)
      bornes.setColorAt(k, couleur.set(po.type === 'nid' ? '#7fb2ff' : po.type === 'nourriture' ? '#ffb347' : '#ffd84a'))
    }
    bornes.instanceMatrix.needsUpdate = true
    if (bornes.instanceColor) bornes.instanceColor.needsUpdate = true

    controles.update()
    renderer.render(scene, camera)
  }

  function liberer() {
    controles.dispose()
    decor.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.() })
    marcheurs.dispose(); fourmis.dispose(); bornes.dispose()
    capsule.dispose()
    texture.dispose(); matSol.dispose(); plan.geometry.dispose()
    renderer.dispose()
  }

  const tourner = (oui) => { controles.autoRotate = oui }

  return { dessiner, redimensionner, liberer, tourner }
}
