import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { Sky, Environment, OrbitControls, PerspectiveCamera, OrthographicCamera, Stats } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useControls, folder } from 'leva'
import Color from 'color'

import Text from './Text'
import './styles.css'

import Sticky, { useSticky } from './Sticky'
import PinArrow from './Sticky/Sticky.pin.arrow'
import PinCamera from './Sticky/Sticky.pin.camera'

function rand(min = 0, max = 1) {
  return min + Math.random() * (max - min)
}

function Jumbo({ color }) {
  const ref = useRef()
  // useFrame(({ clock }) => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3))

  const base = Color(color)

  const color1 = base.darken(0.3)
  const color2 = base.darken(0.2)
  const color3 = base.darken(0.1)

  return (
    <group ref={ref}>
      <Text color={color1.toString()} hAlign="right" position={[-12, 6.5, 0]} children="LOOK" frustumCulled={false} />
      <Text color={color2.toString()} hAlign="right" position={[-12, 0, 0]} children="THIS" frustumCulled={false} />
      <Text color={color3.toString()} hAlign="right" position={[-12, -6.5, 0]} children="BIRD" frustumCulled={false} />
    </group>
  )
}

// This component was auto-generated from GLTF by: https://github.com/react-spring/gltfjsx
function Bird({ speed, factor, url, rotY, ...props }) {
  const Sticky = useSticky()
  const { nodes, materials, animations } = useLoader(GLTFLoader, url)
  const group = useRef()
  const mesh = useRef()
  const [start] = useState(() => Math.random() * 5000)
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])

  const sceneRef = useRef()

  useFrame((state, delta) => {
    // mesh.current.position.y = Math.sin(start + state.clock.elapsedTime) * 5
    // mesh.current.rotation.x = Math.PI / 2 + (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 10
    // mesh.current.rotation.y = (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 2
    // group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
    // group.current.rotation.y += delta * factor
    if (factor !== 0) {
      group.current.rotation.y += delta * factor
    } else {
      group.current.rotation.y = rotY
    }
    mixer.update(delta * speed)
    Sticky.update() // ME
  })
  return (
    <group ref={group} dispose={null}>
      <scene name="Scene" ref={sceneRef} {...props}>
        <mesh
          ref={mesh}
          scale={1.5}
          name="Object_0"
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
          frustumCulled={false}></mesh>
      </scene>
    </group>
  )
}

function RandBird({ x, y, z, bird, speed, factor, rotY }) {
  x ??= rand(20, 100) * (Math.round(Math.random()) ? -1 : 1)
  y ??= rand(-10, 10)
  z ??= rand(-5, 5)
  bird ??= ['Stork', 'Parrot', 'Flamingo'][Math.round(Math.random() * 2)]
  speed ??= bird === 'Stork' ? 0.125 : bird === 'Flamingo' ? 0.25 : 2.5
  factor ??= bird === 'Stork' ? 0.5 + Math.random() : bird === 'Flamingo' ? 0.25 + Math.random() : 1 + Math.random() - 0.5

  console.log(x, y, z, bird, speed, factor)

  return <Bird position={[x, y, z]} rotation={[0, x > 0 ? Math.PI : 0, 0]} speed={speed} factor={factor} rotY={rotY} url={`/${bird}.glb`} />
}

function Birds() {
  return new Array(10).fill().map((_, i) => <RandBird key={i} />)
}

const Pins = {
  camera: PinCamera,
  arrow: PinArrow
}

export default function App() {
  const [numbirds, setNumbirds] = useState(1)
  const [speed, setSpeed] = useState(0)
  const [factor, setFactor] = useState(0)
  const [rotY, setRotY] = useState(0)

  const gui = useControls({
    birds: {
      value: numbirds,
      min: 0,
      step: 1,
      onChange: setNumbirds,
      hint: 'Number of birds to display'
    },
    speed: {
      value: speed,
      min: 0,
      max: 4,
      onChange: setSpeed,
      hint: 'Flapping wings animation speed'
    },
    factor: {
      value: factor,
      min: 0,
      max: 3,
      onChange: setFactor,
      hint: 'Rotating animation speed'
    },
    rotY: {
      value: rotY,
      min: 0,
      max: 2 * Math.PI,
      onChange: setRotY,
      hint: 'Initial rotY angle'
    },
    fov: {
      value: 50,
      min: 0,
      max: 300
    },

    aabb: true,
    Pin: { options: Object.keys(Pins) },
    text: '#567238',
    //
    options: folder({}, { collapsed: true })
  })
  // console.log('gui', gui)

  return (
    <Canvas
    // linear={false}
    //
    >
      <Stats />
      <group>
        <PerspectiveCamera makeDefault position-z={50} fov={gui.fov} />

        <Suspense fallback={null}>
          <Jumbo color={gui.text} />
          {/* <Birds /> */}
          {new Array(numbirds).fill().map((el, i) => {
            // special initial position for the first bird (others are random)
            const pos = i === 0 ? { x: 35, y: 0, z: 0 } : {}

            return (
              <Sticky
                key={i}
                debug={gui.aabb}
                Pin={Pins[gui.Pin]}
                //
              >
                <RandBird
                  {...pos}
                  bird="Stork"
                  speed={speed}
                  factor={factor}
                  rotY={rotY}
                  //
                />
              </Sticky>
            )
          })}

          <Sky />
          {/* <Environment preset="city" /> */}

          <OrbitControls />
        </Suspense>

        <ambientLight intensity={2} />
        <pointLight position={[40, 40, 40]} />
      </group>
    </Canvas>
  )
}
