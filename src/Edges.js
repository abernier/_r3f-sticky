import * as THREE from 'three'
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const EdgesContext = createContext()

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

const toto = (function () {
  const bbox = new THREE.Box3()
  const bs = new THREE.Sphere()

  return function (item, camera) {
    const target = item.groupRef.current
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

    item.pos.set(x, y, z)
  }
})()

function Edges({ children }) {
  const [items, setItems] = useState([])

  const { camera } = useThree()

  useFrame(() => {
    // console.log('toto')
    for (const item of items) {
      toto(item, camera)
    }
  })

  const value = {
    items,
    setItems
  }

  return <EdgesContext.Provider value={value}>{children}</EdgesContext.Provider>
}
function useEdges() {
  return useContext(EdgesContext)
}
export { useEdges }

function EdgesItem({ children }) {
  const { items, setItems } = useEdges()

  const groupRef = useRef(null)
  const pinRef = useRef(null)

  useLayoutEffect(() => {
    const o = {
      groupRef,
      pos: new Vector3(),
      pinRef
    }

    console.log('adding', o, items, performance.now)
    setItems([...items, o])

    // return () => remove(o)
  }, [])

  return <group ref={groupRef}>{children}</group>
}
export { EdgesItem }

export default Edges
