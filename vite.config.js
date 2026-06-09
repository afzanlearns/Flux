import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/**/*.png'],
      manifest: {
        name: 'Flux - Your Money, Clearly',
        short_name: 'Flux',
        description: 'Simple personal finance tracking. Offline-first, no bank integration.',
        theme_color: '#BE185D',
        background_color: '#BE185D',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        id: '/',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor'
          if (id.includes('node_modules/idb/')) return 'idb'
          if (id.includes('node_modules/lucide-react/')) return 'ui'
          if (id.includes('node_modules/recharts/')) return 'charts'
          if (id.includes('node_modules/d3')) return 'charts'
        }
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  }
})
