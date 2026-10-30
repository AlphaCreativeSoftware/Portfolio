// Migration guard: compare the rendered shell and the complete CSS
// before/after extraction. No browser, network, or application data is needed.
import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const directory = new URL('../.artifacts/refactor/', import.meta.url)
const RealDate = Date
globalThis.Date = class extends RealDate {
  constructor(...args) { super(...(args.length ? args : ['2026-10-30T13:30:00Z'])) }
  static now() { return new RealDate('2026-10-30T13:30:00Z').getTime() }
}
const server = await createServer({ cacheDir: '.artifacts/vite-parity-cache', server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const html = {}
  for (const [theme, solar] of [['system', 'auto'], ['light', 'morning'], ['dark', 'night']]) {
    globalThis.localStorage = { getItem: (key) => key === 'portfolio-theme' ? theme : solar }
    html[`${theme}-${solar}`] = renderToStaticMarkup(createElement(App))
  }
  const cssPath = new URL('../src/styles.css', import.meta.url)
  const readStyles = async (url) => {
    const css = await readFile(url, 'utf8')
    if (!css.includes('@import')) return css.replaceAll('\r\n', '\n')
    const imports = [...css.matchAll(/@import\s+['"](.+?)['"];?/g)]
    return (await Promise.all(imports.map((match) => readStyles(new URL(match[1], url))))).join('')
  }
  const current = { html, css: await readStyles(cssPath) }
  if (process.argv.includes('--capture')) {
    await mkdir(directory, { recursive: true })
    await writeFile(new URL('baseline.json', directory), JSON.stringify(current))
    console.log('Baseline saved: 3 appearance variants and complete ordered CSS.')
  } else {
    const baseline = JSON.parse(await readFile(new URL('baseline.json', directory), 'utf8'))
    for (const key of Object.keys(baseline.html)) assert.equal(current.html[key], baseline.html[key], `Rendered DOM changed: ${key}`)
    assert.equal(current.css, baseline.css, 'CSS declarations or cascade order changed')
    console.log('PASS: identical rendered DOM in all 3 variants; CSS identical, in the same cascade order.')
  }
} finally {
  await server.close()
  globalThis.Date = RealDate
  delete globalThis.localStorage
}
