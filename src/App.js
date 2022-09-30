import * as THREE from 'three'
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber'
import { Sky, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Text from './Text'
import './styles.css'

import { EdgesItem, useEdges } from './Edges'

function Jumbo() {
  const ref = useRef()
  // useFrame(({ clock }) => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3))
  return (
    <group ref={ref}>
      {/* <Text hAlign="right" position={[-12, 6.5, 0]} children="THREE" /> */}
      <Text hAlign="right" position={[-12, 0, 0]} children="TRES" />
      {/* <Text hAlign="right" position={[-12, -6.5, 0]} children="TROIS" /> */}
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
  const cameraRef = useRef()

  const { items } = useEdges()

  useFrame(() => {
    // console.log('items=', items)

    const { current: camera } = cameraRef
    // console.log('camera fov', camera.fov)
    // console.log('camera near', camera.near)
    // console.log('camera aspect', camera.aspect)
    const H = 2 * camera.near * Math.tan(((camera.fov / 2) * Math.PI) / 180)
    // console.log('H=', H)
    const W = H * camera.aspect

    items.forEach((item) => {
      // console.log(item.pos.x)
      item.pinRef.current.position.setX((item.pos.x * W) / 2)
      item.pinRef.current.position.setY((item.pos.y * H) / 2)
    })
  })

  return (
    <group
      onClick={() => {
        console.log('click')
        setNumbirds(numbirds + 1)
      }}>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 50]}>
        {items.map((item, i) => {
          const { current: camera } = cameraRef
          // console.log('camera fov', camera.fov)
          // console.log('camera near', camera.near)
          // console.log('camera aspect', camera.aspect)
          const H = 2 * camera.near * Math.tan(((camera.fov / 2) * Math.PI) / 180)
          // console.log('H=', H)
          const W = H * camera.aspect

          const w = (2 / 100) * W
          const h = w

          return (
            <mesh ref={item.pinRef} key={i} position={[-W / 2, 0, 0]} position-z={-camera.near}>
              {/* <circleGeometry args={[h, 32]} /> */}
              <planeGeometry args={[w, h]} />
              <meshBasicMaterial color={'green'} />
            </mesh>
          )
        })}
      </PerspectiveCamera>
      <OrbitControls />

      <ambientLight intensity={2} />
      <pointLight position={[40, 40, 40]} />

      <Suspense fallback={null}>
        <Jumbo />
        {/* <Birds /> */}
        {new Array(numbirds).fill().map((el, i) => (
          <EdgesItem key={i}>
            <RandBird x={32.43157638924359} y={2.1634717810210837} z={4.896611046209522} bird="Stork" speed={5} factor={1.023085260486265} />
          </EdgesItem>
        ))}

        {/* <Sky /> */}
        {/* <Environment preset="city" /> */}
      </Suspense>
    </group>
  )
}
