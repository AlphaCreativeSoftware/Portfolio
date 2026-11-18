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
    assert.match(html, /Ingeniero de Software,<br[^>]*\/> Emprendedor y diseño de producto/)
    assert.match(html, /Construyo software para que el trabajo complejo deje de ser manual/)
    assert.ok(!html.includes('Mi web personal reúne'))
    const hero = html.match(/<section class="home-hero\b[\s\S]*?<\/section>/)[0]
    assert.equal((hero.match(/<a\b/g) ?? []).length, 1)
    assert.match(hero, /href="#espacios"/)
    assert.doesNotMatch(hero, /home-hero-caption|Ver portfolio/)
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
    assert.equal((html.match(/class="home-space-card\b/g) ?? []).length, 3)
    assert.match(html, /href="\/herramientas"[^>]*>[\s\S]*?<h3>Herramientas\.<\/h3>/)
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

test('route table separates home, lazy tools and portfolio, and a real not-found page', async () => {
  const home = matchRoutes(routes, '/').at(-1).route
  const tools = matchRoutes(routes, '/herramientas').at(-1).route
  const portfolio = matchRoutes(routes, '/portfolio').at(-1).route
  const missing = matchRoutes(routes, '/does-not-exist').at(-1).route
  assert.ok(home.index)
  assert.equal(home.Component, HomePage)
  assert.ok(portfolio.lazy)
  assert.notEqual(home, portfolio)
  assert.equal(missing.path, '*')
  assert.equal((await portfolio.lazy()).Component.name, 'PortfolioPage')
  assert.equal((await tools.lazy()).Component.name, 'ToolsPage')
  assert.equal(matchRoutes(routes, '/herramientas/no-publicada').at(-1).route, missing)
})

test('tools page publishes Atlas AV and the tool is a lazy route', async () => {
  const route = matchRoutes(routes, '/herramientas').at(-1).route
  const { Component } = await route.lazy()
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ['/herramientas'] }, createElement(AppearanceProvider, null, createElement(Component))))
  assert.match(html, /<h1 id="tools-title">Herramientas/)
  assert.match(html, /href="\/herramientas\/atlas-av"[^>]*><h2>Atlas AV<\/h2>/)
  assert.equal((html.match(/aria-current="page"[^>]*href="\/herramientas"/g) ?? []).length, 2)
  assert.doesNotMatch(html, /Todavía no hay herramientas|En esta página/)
  assert.ok(matchRoutes(routes, '/herramientas/atlas-av').at(-1).route.lazy)
})

test('empty catalogs still offer the home and portfolio links', async () => {
  const { ToolCatalog } = await server.ssrLoadModule('/src/features/tools/components/ToolCatalog.tsx')
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ToolCatalog, { entries: [] })))
  assert.match(html, /Todavía no hay herramientas publicadas/)
  const emptyActions = html.match(/<div class="tools-empty-actions">([\s\S]*?)<\/div>/)[1]
  assert.deepEqual([...emptyActions.matchAll(/href="([^"]+)"/g)].map((match) => match[1]), ['/', '/portfolio'])
})

test('catalog cards use the same paths as the tool registry and do not load tools', async () => {
  const { ToolCatalog } = await server.ssrLoadModule('/src/features/tools/components/ToolCatalog.tsx')
  const { toolPath } = await server.ssrLoadModule('/src/features/tools/catalog.ts')
  const entry = { slug: 'prueba', title: 'Utilidad de prueba', description: 'Ficha para la prueba del catálogo.', load: () => { throw new Error('Catalog must not load tool code') } }
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ToolCatalog, { entries: [entry] })))
  assert.ok(html.includes(`href="${toolPath(entry.slug)}"`))
  assert.match(html, /<h2>Utilidad de prueba<\/h2>/)
  assert.doesNotMatch(html, /Todavía no hay herramientas/)
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
