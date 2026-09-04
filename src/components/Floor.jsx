import { useMemo } from 'react'
import * as THREE from 'three'
import { HALL } from '../config/world'

const FLOOR = {
  tile: 1.1,
  joint: 0.03,
  base: '#e6e3dd',
  alt: '#e0dcd4',
  jointColor: '#c2bdb4',
  veinStrength: 0.04,
}

const vertexShader = `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = `
  uniform float uTile;
  uniform float uJoint;
  uniform vec3  uBase;
  uniform vec3  uAlt;
  uniform vec3  uJointColor;
  uniform float uVein;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }

  void main() {
    vec2 grid = vWorld.xz / uTile;
    vec2 cell = floor(grid);
    vec2 f = fract(grid);

    float checker = mod(cell.x + cell.y, 2.0);
    vec3 tile = mix(uBase, uAlt, checker * 0.7);

    float vein = noise(vWorld.xz * 1.4) * 0.6 + noise(vWorld.xz * 5.0) * 0.4;
    tile += (vein - 0.5) * uVein;

    float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
    float joint = 1.0 - smoothstep(uJoint * 0.5, uJoint, edge);

    gl_FragColor = vec4(mix(tile, uJointColor, joint), 1.0);
    #include <colorspace_fragment>
  }
`

export default function Floor() {
  const uniforms = useMemo(() => ({
    uTile:       { value: FLOOR.tile },
    uJoint:      { value: FLOOR.joint },
    uBase:       { value: new THREE.Color(FLOOR.base) },
    uAlt:        { value: new THREE.Color(FLOOR.alt) },
    uJointColor: { value: new THREE.Color(FLOOR.jointColor) },
    uVein:       { value: FLOOR.veinStrength },
  }), [])

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[HALL.floorSize, HALL.floorSize]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}