import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

import './styles.css'

import Edges from './Edges'
import App from './App'

createRoot(document.getElementById('root')).render(
  <Canvas>
    <App />
  </Canvas>
)
