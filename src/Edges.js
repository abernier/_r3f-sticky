import * as THREE from 'three'
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Box3, Sphere } from 'three'

const EdgesContext = createContext()

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

const a = 0.02 // size of the pin box (in %)

EdgesItem.defaultProps = {
  render: ({ W, H }) => {
    // console.log('WH', W, H)
    return (
      <mesh onPointerOver={({ object }) => object.scale.set(2, 2, 2)} onPointerOut={({ object }) => object.scale.set(1, 1, 1)}>
        <planeGeometry args={[a * W, a * W]} />
        <meshBasicMaterial color={'green'} />
      </mesh>
    )
  },
  onFrame: ({ x, y, pin, pinIn, W, H }) => {
    pinIn.position.setX((-x * a * W) / 2)
    pinIn.position.setY((-y * a * W) / 2)
  },
  insideAlso: false
}

function EdgesItem({ children, render, onFrame, insideAlso }) {
  const [bbox] = useState(new Box3())
  const [bs] = useState(new Sphere())

  const { camera } = useThree()
  console.log('camera=', camera, camera.near, camera.far, camera.fov)

  let H, W
  if (camera.type === 'PerspectiveCamera') {
    H = 2 * camera.near * Math.tan(((camera.fov / 2) * Math.PI) / 180)
    W = H * camera.aspect
  } else if ('OrthographicCamera') {
    console.log(camera.left, camera.right, camera.top, camera.bottom, camera.zoom)
    H = camera.top - camera.bottom
    W = camera.right - camera.left
  } else {
    console.log('not supported camera type')
  }
  console.log('W/H=', W, H)

  const containerRef = useRef(null)
  const pinRef = useRef(null)
  const pinInRef = useRef(null)

  useFrame(() => {
    console.log('useFrame')
    const { current: target } = containerRef
    target.updateWorldMatrix(true, true)
    bbox.setFromObject(target)

    // bbox.getCenter(center)
    // console.log('center=', center)
    bbox.getBoundingSphere(bs)

    let projectedCenter = bs.center.project(camera)
    // console.log('projectedCenter=', projectedCenter)

    let x, y, z
    x = clamp(projectedCenter.x, -1, 1)
    y = clamp(projectedCenter.y, -1, 1)
    z = clamp(projectedCenter.z, -1, 1)

    const { current: pin } = pinRef
    // console.log('pin=', pin.position)
    pin.position.setX((x * W) / 2)
    pin.position.setY((y * H) / 2)

    // Visible only if offscreen (or explicit `insideAlso` option)
    pin.visible = insideAlso || Math.abs(projectedCenter.x) > 1 || Math.abs(projectedCenter.y) > 1

    const { current: pinIn } = pinInRef
    onFrame({
      pin,
      pinIn,
      W,
      H,
      x,
      y
    })
  })

  useEffect(() => {
    console.log('useEffect')
    // console.log('camera changed', camera.position.z)

    const { current: pin } = pinRef
    pin.position.z = -camera.near
    camera.add(pin)

    return () => camera.remove(pin)
  }, [camera])

  return (
    <>
      <group ref={containerRef}>{children}</group>
      <group ref={pinRef}>
        <group ref={pinInRef}>{render({ W, H })}</group>
      </group>
    </>
  )
}

export { EdgesItem }
