import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

test('the emitted Vercel function starts in Node and serves JSON without TypeScript sources', async (t) => {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const tempRoot = resolve(tmpdir())
  const outDir = await mkdtemp(join(tempRoot, 'atlas-api-runtime-'))
  assert.equal(dirname(resolve(outDir)), tempRoot)
  t.after(() => rm(outDir, { recursive: true, force: true }))

  const read = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile)
  assert.equal(read.error, undefined)
  const config = ts.parseJsonConfigFileContent(read.config, ts.sys, root, { noEmit: false, rootDir: root, outDir })
  assert.deepEqual(config.errors, [])

  // Compile the server graph into an isolated directory, as Vercel does. Importing
  // the .ts entry point in Vite would hide incorrect extensions in the JS output.
  const program = ts.createProgram([join(root, 'api', 'atlas-av.ts')], config.options)
  assert.deepEqual(ts.getPreEmitDiagnostics(program).map((diagnostic) => diagnostic.messageText), [])
  const emitted = program.emit()
  assert.equal(emitted.emitSkipped, false)
  assert.deepEqual(emitted.diagnostics, [])

  const { default: atlas } = await import(pathToFileURL(join(outDir, 'api', 'atlas-av.js')).href)
  const now = Date.now()
  const upstream = t.mock.method(globalThis, 'fetch', async (url) => {
    const { pathname } = new URL(url)
    if (pathname === '/api/v1/trains') return Response.json({ generatedAt: new Date(now).toISOString(), trains: [] })
    if (pathname === '/vehicle_positions_LD.json') return Response.json({ header: { timestamp: Math.floor(now / 1000) }, entity: [] })
    return new Response(null, { status: 503 })
  })

  const requestUrl = 'https://example.test/api/atlas-av'
  const disallowed = await atlas.fetch(new Request(requestUrl, { method: 'POST' }))
  assert.equal(disallowed.status, 405)
  assert.equal(upstream.mock.callCount(), 0)
  const response = await atlas.fetch(new Request(requestUrl))
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /^application\/json/)
  assert.deepEqual((await response.json()).trains, [])
})
