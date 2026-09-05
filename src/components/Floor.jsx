import { useMemo } from 'react'
import * as THREE from 'three'
import { OUTLINE } from '../config/world'

const FLOOR = {
  tile: 1.1,
  joint: 0.03,
  base: '#e6e3dd',
  alt: '#e0dcd4',
  jointColor: '#c2bdb4',
  veinStrength: 0.04,
}

// Bruit et déclarations, injectés dans le shader standard.
const COMMON = `
  varying vec3 vWorldPos;
  uniform float uTile;
  uniform float uJoint;
  uniform vec3  uBase;
  uniform vec3  uAlt;
  uniform vec3  uJointColor;
  uniform float uVein;

  float fhash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float fnoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(fhash(i), fhash(i + vec2(1,0)), f.x),
               mix(fhash(i + vec2(0,1)), fhash(i + vec2(1,1)), f.x), f.y);
  }
`

// Remplace la couleur de base. Le reste du pipeline standard —
// éclairage, ombres reçues, brouillard — s'applique ensuite normalement.
const PATTERN = `
  vec2 grid = vWorldPos.xz / uTile;
  vec2 cell = floor(grid);
  vec2 fc   = fract(grid);

  float checker = mod(cell.x + cell.y, 2.0);
  vec3 tile = mix(uBase, uAlt, checker * 0.7);

  float vein = fnoise(vWorldPos.xz * 1.4) * 0.6 + fnoise(vWorldPos.xz * 5.0) * 0.4;
  tile += (vein - 0.5) * uVein;

  float edge  = min(min(fc.x, 1.0 - fc.x), min(fc.y, 1.0 - fc.y));
  float joint = 1.0 - smoothstep(uJoint * 0.5, uJoint, edge);

  diffuseColor.rgb = mix(tile, uJointColor, joint);
`

export default function Floor() {
  // Le sol épouse le contour du hall : au-delà, plus rien.
  // C'est ce qui permettra de descendre le tarmac sous le niveau 0.
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    // Un Shape vit dans le plan XY. La rotation de −90° autour de X envoie
    // y sur −z : on inverse donc z à la construction pour retomber juste.
    OUTLINE.forEach(([x, z], i) => {
      if (i === 0) shape.moveTo(x, -z)
      else shape.lineTo(x, -z)
    })
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [])

  const uniforms = useMemo(() => ({
    uTile:       { value: FLOOR.tile },
    uJoint:      { value: FLOOR.joint },
    uBase:       { value: new THREE.Color(FLOOR.base) },
    uAlt:        { value: new THREE.Color(FLOOR.alt) },
    uJointColor: { value: new THREE.Color(FLOOR.jointColor) },
    uVein:       { value: FLOOR.veinStrength },
  }), [])

  const onBeforeCompile = useMemo(() => (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vWorldPos;`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${COMMON}`)
      .replace('#include <map_fragment>', PATTERN)
  }, [uniforms])

  return (
    <mesh
      geometry={geometry}
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        roughness={0.85}
        metalness={0}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  )
}