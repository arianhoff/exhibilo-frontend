import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Agregá acá el resto de tus rutas reales */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
