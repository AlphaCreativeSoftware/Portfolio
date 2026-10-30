import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createTestServer } from './helpers/vite-server.mjs'

let server
let SiteHeader
let AppearanceProvider
let resolveDestinationSelection

before(async () => {
  server = await createTestServer('.artifacts/vite-header-test-cache')
  SiteHeader = (await server.ssrLoadModule('/src/components/layout/SiteHeader.tsx')).SiteHeader
  AppearanceProvider = (await server.ssrLoadModule('/src/features/appearance/AppearanceProvider.tsx')).AppearanceProvider
  resolveDestinationSelection = (await server.ssrLoadModule('/src/components/layout/destinationMotion.ts')).resolveDestinationSelection
  globalThis.localStorage = { getItem: (key) => key === 'portfolio-theme' ? 'light' : 'auto' }
})
after(async () => { await server?.close(); delete globalThis.localStorage })

function renderContext(page, section) {
  const navigation = {
    items: [], scrolled: false, menuOpen: false,
    activeSection: section ? 'section' : 'inicio',
    isAtStart: !section, currentSectionLabel: section ?? 'Inicio',
    scrollProgressRef: { current: null }, navRef: { current: null },
    menuPanelRef: { current: null }, menuButtonRef: { current: null },
    navIndicator: { x: 0, y: 0, width: 0, height: 0, visible: false, moving: false },
    navigateTo() {}, setMenuOpen() {}, closeMenu() {},
  }
  return renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [page === 'home' ? '/' : '/portfolio'] }, createElement(AppearanceProvider, null, createElement(SiteHeader, { navigation, page }))))
}

for (const [page, area] of [['home', 'Web principal'], ['portfolio', 'Portfolio']]) {
  test(`mobile context shows only ${area} in the opening hero`, () => {
    const html = renderContext(page)
    assert.ok(html.includes(`<strong class="mobile-area-label">${page === 'home' ? 'Principal' : area}</strong>`))
    assert.ok(html.includes(`class="mobile-section-label" aria-label="${area}"`))
    assert.ok(!html.includes('mobile-section-context'))
    assert.ok(!html.includes('mobile-context-divider'))
  })
}

for (const [page, area, section] of [['portfolio', 'Portfolio', 'Proyectos'], ['home', 'Web principal', 'Áreas'], ['home', 'Web principal', 'Contacto']]) {
  test(`mobile context distinguishes ${area} from ${section}`, () => {
    const html = renderContext(page, section)
    assert.ok(html.includes(`aria-label="${area}: ${section}"`))
    assert.ok(html.includes(`<strong class="mobile-area-label">${page === 'home' ? 'Principal' : area}</strong>`))
    assert.ok(html.includes('class="mobile-context-divider" aria-hidden="true"></span>'))
    assert.ok(html.includes(`class="mobile-current-section" title="${section}">${section}</span>`))
  })
}

test('destination indicators are decorative; route links retain their own current-page semantics', () => {
  for (const page of ['home', 'portfolio']) {
    const html = renderContext(page)
    assert.equal((html.match(/class="site-destination-indicator" aria-hidden="true"/g) ?? []).length, 2)
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 2)
    for (const destination of ['/', '/portfolio']) assert.equal((html.match(new RegExp(`data-destination="${destination}"`, 'g')) ?? []).length, 2)
  }
})

test('outgoing header cannot consume the incoming header animation origin', () => {
  const initial = resolveDestinationSelection(undefined, '/', 'home-entry')
  assert.equal(initial.origin, '/')
  const outgoing = resolveDestinationSelection(initial, '/portfolio', 'portfolio-entry')
  const incoming = resolveDestinationSelection(outgoing, '/portfolio', 'portfolio-entry')
  const strictModeReplay = resolveDestinationSelection(incoming, '/portfolio', 'portfolio-entry')
  assert.equal(incoming.origin, '/')
  assert.equal(strictModeReplay.origin, '/')
  assert.equal(incoming, outgoing)
  const back = resolveDestinationSelection(incoming, '/', 'home-entry')
  assert.equal(back.origin, '/portfolio')
  const hashChange = resolveDestinationSelection(back, '/', 'home-anchor-entry')
  assert.equal(hashChange.origin, '/')
  const futureArea = resolveDestinationSelection(hashChange, '/laboratorio', 'lab-entry')
  assert.equal(futureArea.origin, '/')
  assert.equal(resolveDestinationSelection(futureArea, '/laboratorio', 'lab-entry').origin, '/')
})
