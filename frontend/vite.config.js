import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootEnvDir = path.resolve(__dirname, '..')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, rootEnvDir, '')
  const apiRoot = env.VITE_API_ROOT || env.API_ROOT
  const normalizedApiRoot = (apiRoot || 'http://localhost:8000').replace(/\/$/, '')

  if (mode == 'production' && command == 'build' && !apiRoot) {
    throw Error('please define VITE_API_ROOT environment variable')
  }

  return {
    envDir: rootEnvDir,
    plugins: [react()],
    define: {
      __API_ROOT__: JSON.stringify(normalizedApiRoot)
    },
    server: {
    proxy: {
      // В dev-режиме проксируем запросы к Django
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  }
})
