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
let site

before(async () => {
  server = await createTestServer('.artifacts/vite-home-test-cache')
  HomePage = (await server.ssrLoadModule('/src/pages/HomePage.tsx')).HomePage
  AppearanceProvider = (await server.ssrLoadModule('/src/features/appearance/AppearanceProvider.tsx')).AppearanceProvider
  routes = (await server.ssrLoadModule('/src/app/routes.tsx')).routes
  config = (await server.ssrLoadModule('/src/features/home/data/navigation.ts')).homeNavigation
  spaces = (await server.ssrLoadModule('/src/features/home/data/spaces.ts')).independentSpaces
  legacyDestination = (await server.ssrLoadModule('/src/app/routePaths.ts')).getLegacyPortfolioDestination
  site = (await server.ssrLoadModule('/src/shared/config/site.ts')).site
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
    assert.ok(!html.includes('sector bancario'), 'Current employment belongs in the portfolio')
    assert.ok(!html.includes('/projects/'), 'Homepage must not include individual project artwork')
    assert.ok(!html.includes('El trabajo habla.'), 'Removed promotional copy must not return')
    assert.ok(!html.includes('home-now'), 'Current role card must not return')
    const header = html.match(/<header\b[\s\S]*?<\/header>/)[0]
    assert.ok(!header.includes('Disponible'))
    assert.match(header, /aria-label="Áreas de la web"/)
    assert.match(header, /aria-label="Secciones de la web principal"/)
    assert.match(header, /Web principal/)
    assert.match(header, /class="mobile-area-label">Principal<\/strong>/)
    assert.ok(!header.includes('mobile-section-context'), 'At the start there is no local section or separator')
    const sectionLinks = header.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0]
    assert.ok(!sectionLinks.includes('href="/portfolio"'), 'Page destinations must not be mixed into section links')
    assert.ok(!html.includes('<video'), 'Homepage must not preload the engine video')
    assert.ok(!html.includes('<canvas'), 'No frame sequence should be loaded without portrait assets')
    assert.equal((html.match(/class="home-space-card\b/g) ?? []).length, 2)
    assert.ok(!html.includes('home-space-open-work'), 'Publications must not duplicate Alpha Creative')
    const alpha = html.match(/<article class="home-space-card home-space-alpha-creative"[\s\S]*?<\/article>/)[0]
    assert.equal((alpha.match(/<a\b/g) ?? []).length, 4)
    for (const href of [site.social.apps, site.social.books, site.social.github, site.social.youtube]) assert.ok(alpha.includes(`href="${href.replaceAll('&', '&amp;')}"`))
    assert.ok(alpha.includes('Productos y publicaciones'))
    assert.ok(alpha.includes('Código y contenido'))
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length)
    for (const id of config.sectionIds) assert.ok(ids.includes(id))
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]))
    for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(match[0], /rel="[^"]*noreferrer/)
  })
}

test('all home destinations have real, explicit links', () => {
  for (const space of spaces) {
    assert.ok(space.linkGroups.length > 0)
    assert.equal(new Set(space.linkGroups.map((group) => group.id)).size, space.linkGroups.length)
    const links = space.linkGroups.flatMap((group) => group.links)
    assert.equal(links.length, 4)
    assert.equal(new Set(links.map((link) => link.href)).size, links.length)
    for (const link of links) assert.match(link.href, /^https:\/\//)
  }
  for (const item of config.items) {
    assert.ok(config.sectionIds.includes(item.id))
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
