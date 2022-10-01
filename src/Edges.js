import * as THREE from 'three'
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const EdgesContext = createContext()

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

function EdgesItem({ children, render }) {
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
  console.log('H/W=', H, W)

  const containerRef = useRef(null)
  const pinRef = useRef(null)

  useEffect(() => {
    // console.log('camera changed', camera.position.z)

    const { current: pin } = pinRef
    pin.position.z = -camera.near
    camera.add(pin)

    return () => camera.remove(pin)
  }, [camera])

  useFrame(
    (function () {
      const bbox = new THREE.Box3()
      const bs = new THREE.Sphere()

      return function () {
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
      }
    })()
  )

  return (
    <>
      <group ref={containerRef}>{children}</group>
      <group ref={pinRef}>{render(W, H)}</group>
    </>
  )
}
export { EdgesItem }
