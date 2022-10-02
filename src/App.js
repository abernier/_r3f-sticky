import * as THREE from 'three'
import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber'
import { Sky, Environment, OrbitControls, PerspectiveCamera, OrthographicCamera } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Text from './Text'
import './styles.css'

import { EdgesItem } from './Edges'

function Jumbo() {
  const ref = useRef()
  // useFrame(({ clock }) => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3))
  return (
    <group ref={ref}>
      <Text hAlign="right" position={[-12, 6.5, 0]} children="THREE" frustumCulled={false} />
      <Text hAlign="right" position={[-12, 0, 0]} children="TRES" frustumCulled={false} />
      <Text hAlign="right" position={[-12, -6.5, 0]} children="TROIS" frustumCulled={false} />
    </group>
  )
}

// This component was auto-generated from GLTF by: https://github.com/react-spring/gltfjsx
function Bird({ speed, factor, url, ...props }) {
  const { nodes, materials, animations } = useLoader(GLTFLoader, url)
  const group = useRef()
  const mesh = useRef()
  const [start] = useState(() => Math.random() * 5000)
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useEffect(() => void mixer.clipAction(animations[0], group.current).play(), [])
  useFrame((state, delta) => {
    mesh.current.position.y = Math.sin(start + state.clock.elapsedTime) * 5
    mesh.current.rotation.x = Math.PI / 2 + (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 10
    mesh.current.rotation.y = (Math.sin(start + state.clock.elapsedTime) * Math.PI) / 2
    group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
    mixer.update(delta * speed)
  })
  return (
    <group ref={group} dispose={null}>
      <scene name="Scene" {...props}>
        <mesh
          ref={mesh}
          scale={1.5}
          name="Object_0"
          morphTargetDictionary={nodes.Object_0.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_0.morphTargetInfluences}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={nodes.Object_0.geometry}
          material={materials.Material_0_COLOR_0}
          frustumCulled={false}
        />
      </scene>
    </group>
  )
}

function RandBird({ x, y, z, bird, speed, factor }) {
  x ||= (20 + Math.random() * 80) * (Math.round(Math.random()) ? -1 : 1)
  y ||= -10 + Math.random() * 20
  z ||= -5 + Math.random() * 10
  bird ||= ['Stork', 'Parrot', 'Flamingo'][Math.round(Math.random() * 2)]
  speed ||= bird === 'Stork' ? 0.125 : bird === 'Flamingo' ? 0.25 : 2.5
  factor ||= bird === 'Stork' ? 0.5 + Math.random() : bird === 'Flamingo' ? 0.25 + Math.random() : 1 + Math.random() - 0.5

  useEffect(() => {
    console.log(x, y, z, bird, speed, factor)
  }, [x, y, z, bird, speed, factor])

  return <Bird position={[x, y, z]} rotation={[0, x > 0 ? Math.PI : 0, 0]} speed={speed} factor={factor} url={`/${bird}.glb`} />
}

function Birds() {
  return new Array(10).fill().map((_, i) => <RandBird key={i} />)
}

export default function App() {
  const [numbirds, setNumbirds] = useState(1)
  const [camNth, setCamNth] = useState(0)

  const w = 2 / 100
  const h = 2 / 100

  return (
    <group
      onClick={() => {
        console.log('click')
        setNumbirds(numbirds + 1)
        setCamNth(camNth + 1)
      }}>
      <PerspectiveCamera makeDefault={camNth % 2 === 0} position={[0, 0, 50]} fov={50}></PerspectiveCamera>
      <PerspectiveCamera makeDefault={camNth % 2 === 1} position={[0, 0, 30]} fov={90}></PerspectiveCamera>
      {/* <OrthographicCamera makeDefault={camNth % 3 === 2} near={0.00001}></OrthographicCamera> */}
      {/* <OrthographicCamera makeDefault zoom={5}></OrthographicCamera> */}

      <Suspense fallback={null}>
        <Jumbo />
        {/* <Birds /> */}
        {new Array(numbirds).fill().map((el, i) => (
          <EdgesItem
            key={i}
            // camera={bool ? persRef.current : orthRef.current}
            // render={({ W, H }) => {
            //   // console.log('WH', W, H)
            //   return (
            //     <mesh onPointerOver={({ object }) => object.scale.set(2, 2, 2)} onPointerOut={({ object }) => object.scale.set(1, 1, 1)}>
            //       <planeGeometry args={[w * W, h * W]} />
            //       <meshBasicMaterial color={'green'} />
            //     </mesh>
            //   )
            // }}
            // insideAlso
            // onFrame={({ x, y, pin, pinIn, W, H }) => {
            //   // console.log((pos.x * 2) / 100)

            //   pinIn.position.setX((-x * w * W) / 2)
            //   pinIn.position.setY((-y * h * W) / 2)
            // }}
          >
            <RandBird x={32.43157638924359} y={2.1634717810210837} z={4.896611046209522} bird="Stork" speed={5} factor={1.023085260486265} />
          </EdgesItem>
        ))}

        {/* <Sky /> */}
        {/* <Environment preset="city" /> */}

        <OrbitControls />
      </Suspense>

      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />
    </group>
  )
}
