import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, createMemoryRouter, matchRoutes } from 'react-router-dom'
import { createTestServer } from './helpers/vite-server.mjs'

let server
let HomePage
let AppearanceProvider
let routes
let config
let spaces
let legacyDestination

before(async () => {
  server = await createTestServer('.artifacts/vite-home-test-cache')
  HomePage = (await server.ssrLoadModule('/src/pages/HomePage.tsx')).HomePage
  AppearanceProvider = (await server.ssrLoadModule('/src/features/appearance/AppearanceProvider.tsx')).AppearanceProvider
  routes = (await server.ssrLoadModule('/src/app/routes.tsx')).routes
  config = (await server.ssrLoadModule('/src/features/home/data/navigation.ts')).homeNavigation
  spaces = (await server.ssrLoadModule('/src/features/home/data/spaces.ts')).independentSpaces
  legacyDestination = (await server.ssrLoadModule('/src/app/routePaths.ts')).getLegacyPortfolioDestination
})

after(async () => { await server?.close(); delete globalThis.localStorage })

for (const theme of ['light', 'dark']) {
  test(`home has one clear identity, valid navigation and no heavy media (${theme})`, () => {
    globalThis.localStorage = { getItem: (key) => key === 'portfolio-theme' ? theme : 'auto' }
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AppearanceProvider, null, createElement(HomePage))))
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
    assert.equal((html.match(/<main\b/g) ?? []).length, 1)
    assert.match(html, /id="home-title"/)
    assert.match(html, /Mikael/)
    assert.match(html, /Rodríguez/)
    assert.match(html, /href="\/portfolio"/)
    assert.match(html, /href="\/portfolio#experiencia"/)
    assert.ok(!html.includes('<video'), 'Homepage must not preload the engine video')
    assert.ok(!html.includes('<canvas'), 'No frame sequence should be loaded without portrait assets')
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length)
    for (const id of config.sectionIds) assert.ok(ids.includes(id))
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]))
    for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(match[0], /rel="[^"]*noreferrer/)
  })
}

test('all home destinations have real, explicit links', () => {
  for (const space of spaces) {
    assert.ok(space.links.length > 0)
    for (const link of space.links) assert.match(link.href, /^https:\/\//)
  }
  for (const item of config.items) {
    if (item.to) assert.ok(matchRoutes(routes, item.to))
    else assert.ok(config.sectionIds.includes(item.id))
  }
})

test('route table separates home, lazy portfolio and a real not-found page', async () => {
  const home = matchRoutes(routes, '/').at(-1).route
  const portfolio = matchRoutes(routes, '/portfolio').at(-1).route
  const missing = matchRoutes(routes, '/does-not-exist').at(-1).route
  assert.ok(home.index)
  assert.equal(home.Component, HomePage)
  assert.ok(portfolio.lazy)
  assert.notEqual(home, portfolio)
  assert.equal(missing.path, '*')
  assert.equal((await portfolio.lazy()).Component.name, 'PortfolioPage')
})

test('previous portfolio bookmarks migrate without taking over homepage anchors', () => {
  for (const hash of ['#proyectos', '#experiencia', '#habilidades', '#sobre-mi']) assert.equal(legacyDestination('/', hash), '/portfolio' + hash)
  for (const hash of ['', '#inicio', '#espacios', '#mirada', '#contacto']) assert.equal(legacyDestination('/', hash), null)
  assert.equal(legacyDestination('/portfolio', '#experiencia'), null)
  assert.equal(legacyDestination('/', '#proyectos', '?ref=linkedin'), '/portfolio?ref=linkedin#proyectos')
})

test('direct portfolio routes initialize without changing their anchors', async () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/portfolio#experiencia'] })
  try {
    if (!router.state.initialized) await new Promise((resolve) => {
      const unsubscribe = router.subscribe((state) => { if (state.initialized) { unsubscribe(); resolve() } })
    })
    assert.equal(router.state.location.pathname, '/portfolio')
    assert.equal(router.state.location.hash, '#experiencia')
    assert.equal(router.state.errors, null)
  } finally { router.dispose() }
})
