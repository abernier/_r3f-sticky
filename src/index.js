import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

import './styles.css'

import App from './App'

createRoot(document.getElementById('root')).render(
  <Canvas>
    {/* <color attach="background" args={['#d8f2ff']} /> */}
    <App />
  </Canvas>
)
