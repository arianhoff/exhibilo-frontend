// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home.jsx'
import Categoria from '@/pages/Categoria.jsx'   // si ya la creaste
import Proyecto from '@/pages/Proyecto.jsx'     // 👈 NUEVO

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categoria/:slug" element={<Categoria />} />
      <Route path="/proyecto/:id" element={<Proyecto />} />   {/* 👈 NUEVO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
