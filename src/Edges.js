import * as THREE from 'three'
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

const EdgesContext = createContext()

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}

function Edges({ children }) {
  const [items, setItems] = useState([])
  const { camera } = useThree()

  useFrame(() => {
    // console.log('toto')
  })

  const value = {
    add(item) {
      setItems([...items, item])
    }
  }

  return <EdgesContext.Provider value={value}>{children}</EdgesContext.Provider>
}
function useEdges() {
  return useContext(EdgesContext)
}
export { useEdges }

function EdgesItem({ children }) {
  const ref = useRef(null)
  const [bbox] = useState(() => new THREE.Box3())
  const [center] = useState(() => new THREE.Vector3())
  const [bs] = useState(() => new THREE.Sphere())

  const [mesh] = useState(() => new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 16), new THREE.MeshBasicMaterial({ color: 'red' })))
  const [pos] = useState(() => new THREE.Vector3())

  const { scene, camera } = useThree()

  useFrame(() => {
    // console.log('projectionMatrix elements', camera.matrix.elements)

    const target = ref.current
    target.updateWorldMatrix(true, true)
    bbox.setFromObject(target)

    // bbox.getCenter(center)
    // console.log('center=', center)

    bbox.getBoundingSphere(bs)
    // mesh.scale.setScalar(bs.radius / 0.1)

    let projectedCenter = bs.center.project(camera)
    // console.log('projectedCenter=', projectedCenter)

    let x, y, z
    x = clamp(projectedCenter.x, -1, 1)
    y = clamp(projectedCenter.y, -1, 1)
    // z = clamp(projectedCenter.z, -1, 1)
    z = projectedCenter.z
    // z = 0.99
    // console.log(x, y, z)

    pos.set(x, y, z)
    pos.unproject(camera)

    mesh.visible = Math.abs(projectedCenter.x) >= 1 || Math.abs(projectedCenter.y) >= 1

    mesh.position.copy(pos)
  })

  useLayoutEffect(() => {
    scene.add(mesh)

    return () => {
      scene.remove(mesh)
    }
  }, [])

  return <group ref={ref}>{children}</group>
}
export { EdgesItem }

export default Edges
