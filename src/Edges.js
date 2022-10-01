import * as THREE from 'three'
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const EdgesContext = createContext()

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

function EdgesItem({ children, renderPin }) {
  const { camera } = useThree()
  const H = 2 * camera.near * Math.tan(((camera.fov / 2) * Math.PI) / 180)
  const W = H * camera.aspect

  let [mesh] = useState(new THREE.Mesh(new THREE.PlaneGeometry((2 / 100) * W, (2 / 100) * W), new THREE.MeshBasicMaterial({ color: 'green' })))

  const groupRef = useRef(null)
  // const pinRef = useRef(null)

  useFrame(
    (function () {
      const bbox = new THREE.Box3()
      const bs = new THREE.Sphere()

      return function () {
        const target = groupRef.current
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

        // mesh.position.set(x, y, z)
        mesh.position.setX((x * W) / 2)
        mesh.position.setY((y * W) / 2)
      }
    })()
  )

  useLayoutEffect(() => {
    mesh.position.z = -camera.near
    camera.add(mesh)

    return () => camera.remove(mesh)
  }, [])

  return <group ref={groupRef}>{children}</group>
}
export { EdgesItem }
