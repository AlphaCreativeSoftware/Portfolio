import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Connect, Plugin } from 'vite'
import { atlasResponse } from './src/features/tools/atlas-av/apiResponse'
import { atlasEndpoint } from './src/features/tools/atlas-av/model'

const atlasLocal: Plugin = {
  name: 'atlas-av-api',
  configureServer(server) { server.middlewares.use(atlasEndpoint, atlasMiddleware) },
  configurePreviewServer(server) { server.middlewares.use(atlasEndpoint, atlasMiddleware) },
}

const atlasMiddleware: Connect.NextHandleFunction = async (req, res, next) => {
  if (req.url?.split('?')[0] !== '/') return next()
  const response = await atlasResponse(req.method ?? 'GET')
  res.writeHead(response.status, Object.fromEntries(response.headers))
  res.end(await response.text())
}

export default defineConfig({ plugins: [react(), atlasLocal] })
