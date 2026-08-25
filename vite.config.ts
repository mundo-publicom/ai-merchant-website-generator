import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { enhanceApi } from './vite-plugins/enhanceApi.ts'
import { spaFallback } from './vite-plugins/spaFallback.ts'

export default defineConfig(({ mode }) => {
  // Empty prefix so OPENAI_API_KEY is read from .env.local without a VITE_
  // prefix - it is used by the dev-server middleware only and never bundled.
  const env = loadEnv(mode, process.cwd(), '')

  // GitHub Pages serves a project site from /<repo>/, so assets need that
  // prefix. The deploy workflow sets BASE_PATH; a user/org site or a custom
  // domain serves from the root and needs no override.
  const base = env.BASE_PATH || '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      enhanceApi({
        apiKey: env.OPENAI_API_KEY,
        model: env.OPENAI_MODEL,
        baseURL: env.OPENAI_BASE_URL,
      }),
      spaFallback(),
    ],
    resolve: {
      alias: { '@': new URL('./src', import.meta.url).pathname },
    },
  }
})
