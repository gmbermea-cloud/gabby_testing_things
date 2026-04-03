import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        curriculum: resolve(__dirname, 'curriculum.html'),
        evaluator:  resolve(__dirname, 'evaluator.html'),
      },
    },
  },
})
