// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    plugins: [react()],
    base: '/',
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    build: { outDir: 'dist', sourcemap: false },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // ej. https://retail-solutions-1.preview.emergentagent.com
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ''),
        }
      }
    }
  })
}
