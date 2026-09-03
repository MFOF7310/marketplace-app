import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/market/',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if(id.includes('node_modules/react')) return 'vendor-react';
          if(id.includes('node_modules/@supabase')) return 'vendor-supabase';
          if(id.includes('node_modules/lucide-react')) return 'vendor-lucide';
        }
      }
    }
  }
})
