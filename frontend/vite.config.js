import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let api_root = 'http://127.0.0.1:8000/';
  if (mode == 'production' && command == 'build') {
    api_root = process.env.API_ROOT;
    if (!api_root) {
      throw Error('please define API_ROOT environment variable')
    }
  }
  return {
    plugins: [react()],
    define: {
      __API_ROOT__: JSON.stringify(api_root)
    }
  }
})
