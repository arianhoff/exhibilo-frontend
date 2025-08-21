// src/main.jsx
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import App from './App.jsx'
import './index.css'
import './App.css'
import { Toaster } from '@/components/ui/sonner.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />
        <Toaster /> {/* ⬅️ aquí lo montamos */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)