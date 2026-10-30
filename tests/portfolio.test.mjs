import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

let server
let model
let navigation
let projects
let App

before(async () => {
  server = await createServer({ cacheDir: '.artifacts/vite-test-cache', server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } })
  model = await server.ssrLoadModule('/src/features/appearance/model.ts')
  navigation = await server.ssrLoadModule('/src/features/portfolio/data/navigation.ts')
  projects = (await server.ssrLoadModule('/src/features/portfolio/data/projects.ts')).projects
  App = (await server.ssrLoadModule('/src/App.tsx')).default
})

after(async () => {
  await server?.close()
  delete globalThis.localStorage
})

for (const [hour, minute, period] of [[4, 59, 'night'], [5, 0, 'morning'], [11, 59, 'morning'], [12, 0, 'afternoon'], [20, 29, 'afternoon'], [20, 30, 'night']]) {
  test(`solar period boundary ${hour}:${String(minute).padStart(2, '0')} -> ${period}`, () => {
    assert.equal(model.getDayPeriod(new Date(2026, 9, 30, hour, minute)), period)
  })
}

test('sun follows the existing arc; manual night is independent from the day clock', () => {
  assert.deepEqual(model.getAtmospherePosition(new Date(2026, 9, 30, 5, 0), 'morning'), { right: 13, top: 32 })
  assert.deepEqual(model.getAtmospherePosition(new Date(2026, 9, 30, 13, 0), 'night'), { right: 8, top: 20 })
  for (let minute = 0; minute < 24 * 60; minute += 5) {
    const date = new Date(2026, 9, 30, 0, minute)
    const position = model.getAtmospherePosition(date, model.getDayPeriod(date))
    assert.ok(position.right >= 4 && position.right <= 13)
    assert.ok(position.top >= 16 && position.top <= 32)
  }
  const beforeMidnight = model.getAtmospherePosition(new Date(2026, 9, 30, 23, 59), 'night')
  const afterMidnight = model.getAtmospherePosition(new Date(2026, 9, 31, 0, 0), 'night')
  assert.ok(Math.abs(beforeMidnight.right - afterMidnight.right) < .1)
  assert.ok(Math.abs(beforeMidnight.top - afterMidnight.top) < .1)
})

test('navigation and project catalogs have stable, unique identities', () => {
  assert.equal(new Set(navigation.sectionIds).size, navigation.sectionIds.length)
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length)
  assert.equal(new Set(projects.map((project) => project.index)).size, projects.length)
  for (const item of navigation.portfolioNavigation) {
    assert.ok(navigation.sectionIds.includes(item.id))
    assert.equal(item.label, navigation.sectionLabels[item.id])
    assert.match(item.number, /^\d{2}$/)
  }
})

for (const [theme, solar] of [['system', 'auto'], ['light', 'morning'], ['dark', 'night']]) {
  test(`portfolio shell: landmarks, anchors, assets and lazy details (${theme}/${solar})`, () => {
    globalThis.localStorage = { getItem: (key) => key === 'portfolio-theme' ? theme : solar }
    const html = renderToStaticMarkup(createElement(App))
    assert.equal((html.match(/<main\b/g) ?? []).length, 1)
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
    assert.equal((html.match(/<header\b/g) ?? []).length, 1)
    assert.equal((html.match(/<footer\b/g) ?? []).length, 1)
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length, 'Duplicate DOM ids')
    for (const id of navigation.sectionIds) assert.ok(ids.includes(id), `Missing section ${id}`)
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Broken anchor ${match[1]}`)
    for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(match[0], /rel="[^"]*noreferrer/)
    for (const match of html.matchAll(/(?:src|poster)="(\/[^\"]+)"/g)) {
      assert.ok(existsSync(fileURLToPath(new URL('../public' + match[1], import.meta.url))), `Missing asset ${match[1]}`)
    }
    assert.equal((html.match(/class="[^"]*featured-showcase/g) ?? []).length, 4)
    assert.ok(!html.includes('class="project-details-inner"'), 'Details should not mount until first opening')
    assert.match(html, /preload="none"/)
    assert.match(html, /video_1\.webm/)
    assert.match(html, /video_1\.mp4/)
  })
}
