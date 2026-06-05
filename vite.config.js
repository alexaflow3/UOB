import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub Pages project path: https://alexaflow3.github.io/UOB/
export default defineConfig({
  base: '/UOB/',
  plugins: [react()],
})
