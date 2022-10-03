import * as THREE from 'three'
import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Box3, Sphere, Vector3, MathUtils } from 'three'

const { degToRad, radToDeg, clamp } = MathUtils

const EdgesContext = createContext()

function EdgesItem({ children, Pin }) {
  const [bbox] = useState(new Box3())
  const [bs] = useState(new Sphere())

  const { camera } = useThree()

  const [values, setValues] = useState({})

  const containerRef = useRef(null)
  const pinRef = useRef(null)

  function update() {
    // console.log('udpate')

    //
    // vw vh
    //

    let vh, vw
    if (camera.type === 'PerspectiveCamera') {
      vh = (2 * camera.near * Math.tan(degToRad(camera.fov / 2))) / 100
      vw = vh * camera.aspect
    } else if ('OrthographicCamera') {
      console.log(camera.left, camera.right, camera.top, camera.bottom, camera.zoom)
      vh = camera.top - camera.bottom
      vw = camera.right - camera.left
    } else {
      console.log('not supported camera type')
    }
    console.log('vw/vh=', vw, vh)

    //
    // x y
    //

    const { current: target } = containerRef
    target.updateWorldMatrix(true, true)
    bbox.setFromObject(target)

    bbox.getBoundingSphere(bs)
    // console.log('bs=', bs)

    let projectedCenter = bs.center.project(camera)
    // console.log('projectedCenter=', projectedCenter)

    const theta = Math.atan2(projectedCenter.y, projectedCenter.x)
    // console.log('theta=', radToDeg(theta))

    let x, y, z
    x = clamp(projectedCenter.x, -1, 1)
    y = clamp(projectedCenter.y, -1, 1)
    // z = clamp(projectedCenter.z, -1, 1)

    // Visible only if offscreen
    const offscreen = Math.abs(projectedCenter.x) > 1 || Math.abs(projectedCenter.y) > 1

    setValues({
      vw,
      vh,
      x,
      y,
      theta,
      offscreen
    })
  }

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
    // console.log('camera changed', camera.position.z)

    const { current: pin } = pinRef
    pin.position.z = -camera.near
    camera.add(pin)

    update()

    return () => camera.remove(pin)
  }, [camera])

  const value = {
    update,
    values
  }

  return (
    <EdgesContext.Provider value={value}>
      <group ref={containerRef}>{children}</group>
      <group ref={pinRef}>
        <Pin />
      </group>
    </EdgesContext.Provider>
  )
}

EdgesItem.defaultProps = {
  Pin: Pin
}

function Pin({ vw, vh, a }) {
  console.log('Pin', vw, vh, a)
  const vertices = new Float32Array([0, 0, -a * vw, a * vw, -a * vw, -a * vw])
  return (
    <group>
      <mesh
      // onPointerOver={({ object }) => object.scale.set(2, 2, 2)}
      // onPointerOut={({ object }) => object.scale.set(1, 1, 1)}
      >
        <planeGeometry args={[a * vw, a * vw]} />
        <meshBasicMaterial color={'green'} />
      </mesh>
      {/* <mesh>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={vertices} count={3} itemSize={2} />
        </bufferGeometry>
        <meshStandardMaterial attach="material" color="hotpink" />
      </mesh> */}
    </group>
  )
}

export const useEdgesItem = () => useContext(EdgesContext)

export { EdgesItem }
