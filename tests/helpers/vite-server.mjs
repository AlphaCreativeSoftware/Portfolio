import { createServer } from 'vite'

/** SSR-only test environment: no HTTP/HMR listener and no dependency scanning. */
export function createTestServer(cacheDir) {
  return createServer({
    cacheDir,
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  })
}
