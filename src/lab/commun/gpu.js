// ============================================================
//  GPU COMMUN : une petite boîte à outils WebGL2
//  Programmes plein écran (un seul triangle qui couvre l'image),
//  réglage des uniformes par leur nom, cibles de rendu flottantes
//  (calcul dans des textures, aller-retour entre deux cibles),
//  textures de données. Servira aussi à Lenia.
// ============================================================

// Un triangle qui déborde de l'écran : chaque pixel est couvert une fois, sans tampon de sommets
export const SOMMET = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

/**
 * @param canvas  le <canvas> où dessiner
 * @returns null si WebGL2 n'est pas disponible, sinon
 *   { gl, flottant: '32' | '16' | null, programme, cible, texture, dessiner, lire, detruire }
 */
export function creerGPU(canvas, { preserver = false } = {}) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: preserver,
    powerPreference: 'high-performance',
  })
  if (!gl) return null

  // Rendu dans une texture flottante : 32 bits si possible, 16 bits sinon
  const flottant = gl.getExtension('EXT_color_buffer_float') ? '32' : gl.getExtension('EXT_color_buffer_half_float') ? '16' : null
  const vao = gl.createVertexArray()
  const objets = []

  function compiler(type, source) {
    const s = gl.createShader(type)
    gl.shaderSource(s, source)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      const log = gl.getShaderInfoLog(s)
      gl.deleteShader(s)
      throw new Error(`Shader : ${log}`)
    }
    return s
  }

  /**
   * Un programme plein écran. defines : ['DOUBLE_PRECISION'] → #define ajoutés après #version.
   * regler({ u_nom: valeur }) règle les uniformes ; une texture se passe directement.
   */
  function programme(fragment, defines = []) {
    const source = fragment.replace(/^(#version[^\n]*\n)/, (l) => l + defines.map((d) => `#define ${d}\n`).join(''))
    const p = gl.createProgram()
    const vs = compiler(gl.VERTEX_SHADER, SOMMET)
    const fs = compiler(gl.FRAGMENT_SHADER, source)
    gl.attachShader(p, vs)
    gl.attachShader(p, fs)
    gl.linkProgram(p)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(`Programme : ${gl.getProgramInfoLog(p)}`)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    objets.push(() => gl.deleteProgram(p))

    // Les uniformes actifs, avec leur type : de quoi les régler par leur nom
    const uniformes = {}
    let unite = 0
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i)
      const nom = info.name.replace(/\[0\]$/, '')
      uniformes[nom] = { lieu: gl.getUniformLocation(p, info.name), type: info.type, tableau: info.size > 1, unite: info.type === gl.SAMPLER_2D ? unite++ : -1 }
    }

    function regler(valeurs) {
      gl.useProgram(p)
      for (const [nom, v] of Object.entries(valeurs)) {
        const u = uniformes[nom]
        if (!u || v === undefined || v === null) continue
        switch (u.type) {
          case gl.FLOAT: u.tableau ? gl.uniform1fv(u.lieu, v) : gl.uniform1f(u.lieu, v); break
          case gl.FLOAT_VEC2: gl.uniform2fv(u.lieu, v.flat ? v.flat() : v); break
          case gl.FLOAT_VEC3: gl.uniform3fv(u.lieu, v.flat ? v.flat() : v); break
          case gl.FLOAT_VEC4: gl.uniform4fv(u.lieu, v.flat ? v.flat() : v); break
          case gl.INT:
          case gl.BOOL: u.tableau ? gl.uniform1iv(u.lieu, v) : gl.uniform1i(u.lieu, Number(v)); break
          case gl.INT_VEC2: gl.uniform2iv(u.lieu, v); break
          case gl.INT_VEC3: gl.uniform3iv(u.lieu, v); break
          case gl.INT_VEC4: gl.uniform4iv(u.lieu, v); break
          case gl.SAMPLER_2D:
            gl.activeTexture(gl.TEXTURE0 + u.unite)
            gl.bindTexture(gl.TEXTURE_2D, v)
            gl.uniform1i(u.lieu, u.unite)
            break
          default: break
        }
      }
    }
    return { p, regler }
  }

  /**
   * Une texture. format : 'rgba8' | 'flottant' (RGBA 32 ou 16 bits) | 'rgba16f' | 'r32f' | 'rg32f' | 'rgb32f' | 'rgba32f'
   * (les formats 32 bits se lisent sans lissage : texelFetch, ou lisse = false)
   */
  function texture(w, h, { format = 'rgba8', donnees = null, lisse = false, repeter = false } = {}) {
    const t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, t)
    const filtre = lisse ? gl.LINEAR : gl.NEAREST
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtre)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtre)
    const bord = repeter ? gl.REPEAT : gl.CLAMP_TO_EDGE
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, bord)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, bord)
    remplir(t, w, h, format, donnees)
    objets.push(() => gl.deleteTexture(t))
    return t
  }

  function remplir(t, w, h, format, donnees) {
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    if (format === 'flottant') {
      const demi = flottant === '16'
      gl.texImage2D(gl.TEXTURE_2D, 0, demi ? gl.RGBA16F : gl.RGBA32F, w, h, 0, gl.RGBA, demi ? gl.HALF_FLOAT : gl.FLOAT, donnees)
    } else if (format === 'rgba16f') gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, donnees)
    else if (format === 'r32f') gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, w, h, 0, gl.RED, gl.FLOAT, donnees)
    else if (format === 'rgb32f') gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, w, h, 0, gl.RGB, gl.FLOAT, donnees)
    else if (format === 'rg32f') gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG32F, w, h, 0, gl.RG, gl.FLOAT, donnees)
    else if (format === 'rgba32f') gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, donnees)
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, donnees)
  }

  /**
   * Une cible de rendu (texture + framebuffer). format : 'flottant' (calculs), 'rgba16f'
   * (accumulation, mélangeable) ou 'rgba8' (image). lisse : lecture filtrée (agrandissement).
   */
  function cible(w, h, { format = 'flottant', lisse = false } = {}) {
    const c = { w, h, tex: texture(w, h, { format, lisse }), fbo: gl.createFramebuffer(), format }
    gl.bindFramebuffer(gl.FRAMEBUFFER, c.fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c.tex, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    c.redimensionner = (w2, h2) => {
      c.w = w2
      c.h = h2
      remplir(c.tex, w2, h2, format, null)
    }
    objets.push(() => gl.deleteFramebuffer(c.fbo))
    return c
  }

  /**
   * Dessine un programme plein écran.
   * @param vers   une cible, ou null pour l'écran
   * @param zone   { x, y, w, h } : viewport (par défaut, toute la cible)
   * @param coupe  { x, y, w, h } : seuls ces pixels sont dessinés (scissor)
   * @param poids  si donné, mélange : résultat = poids × nouveau + (1 − poids) × ancien (moyenne qui s'affine)
   */
  function dessiner(prog, valeurs, { vers = null, zone = null, coupe = null, poids = null } = {}) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, vers ? vers.fbo : null)
    const z = zone ?? { x: 0, y: 0, w: vers ? vers.w : gl.drawingBufferWidth, h: vers ? vers.h : gl.drawingBufferHeight }
    gl.viewport(z.x, z.y, z.w, z.h)
    if (coupe) {
      gl.enable(gl.SCISSOR_TEST)
      gl.scissor(coupe.x, coupe.y, coupe.w, coupe.h)
    }
    if (poids !== null) {
      gl.enable(gl.BLEND)
      gl.blendColor(0, 0, 0, poids)
      gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA)
    }
    prog.regler(valeurs)
    gl.bindVertexArray(vao)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (coupe) gl.disable(gl.SCISSOR_TEST)
    if (poids !== null) gl.disable(gl.BLEND)
  }

  // Lit les pixels RGBA8 d'une cible (ligne du bas d'abord, comme WebGL)
  function lire(c, x = 0, y = 0, w = c.w, h = c.h) {
    const out = new Uint8Array(w * h * 4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, c.fbo)
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, out)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return out
  }

  function detruire() {
    for (const f of objets) f()
    objets.length = 0
    gl.deleteVertexArray(vao)
    // On ne libère le contexte que si le canvas a quitté la page. En développement,
    // React (StrictMode) démonte puis remonte aussitôt le même composant : le même
    // canvas resservira, et un contexte perdu ne se récupère pas.
    setTimeout(() => {
      if (!canvas.isConnected) gl.getExtension('WEBGL_lose_context')?.loseContext()
    }, 0)
  }

  return { gl, flottant, programme, cible, texture, remplir, dessiner, lire, detruire }
}
