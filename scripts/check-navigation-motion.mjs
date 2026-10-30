// Optional browser regression: point BASE_URL at dev or preview and provide
// PLAYWRIGHT_MODULE_PATH when Playwright is supplied by an external runtime.
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : 'playwright')
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? 'chrome', headless: true })
const base = process.env.BASE_URL ?? 'http://localhost:5173'

try {
  for (const [width, theme, reducedMotion] of [[1024, 'light', 'no-preference'], [1440, 'dark', 'no-preference'], [1440, 'light', 'reduce'], [390, 'dark', 'no-preference']]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.addInitScript((theme) => {
      localStorage.setItem('portfolio-theme', theme)
      window.destinationMotionEvents = []
      const animate = Element.prototype.animate
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args)
        if (this.classList.contains('site-destination-indicator')) {
          const event = { path: location.pathname, finished: false, connected: false, duration: animation.effect.getTiming().duration, positions: [] }
          window.destinationMotionEvents.push(event)
          const sample = () => {
            if (animation.playState !== 'running' || !this.isConnected) return
            event.positions.push(this.getBoundingClientRect().x)
            requestAnimationFrame(sample)
          }
          requestAnimationFrame(sample)
          animation.addEventListener('finish', () => { event.finished = true; event.connected = this.isConnected })
        }
        return animation
      }
    }, theme)
    await page.goto(base, { waitUntil: 'networkidle' })
    const mobile = width <= 900
    const shouldAnimate = !mobile && reducedMotion !== 'reduce'
    const selector = mobile ? '.mobile-site-destinations' : '.desktop-site-destinations'
    const open = async () => {
      if (mobile) await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    }
    const verify = async (path) => {
      await page.waitForURL(base + path)
      if (shouldAnimate) {
        // A single running frame is insufficient: the original bug cancelled
        // the animation in the outgoing header after just 5–30 milliseconds.
        await page.waitForFunction((path) => window.destinationMotionEvents.some((event) => event.path === path && event.finished && event.connected), path)
        const finished = await page.evaluate((path) => window.destinationMotionEvents.findLast((event) => event.path === path && event.finished && event.connected), path)
        assert.equal(finished.duration, 440)
        assert.ok(finished.positions.length > 3, 'Motion must span multiple visible frames')
        assert.ok(Math.max(...finished.positions) - Math.min(...finished.positions) > 40, 'The visible pill must traverse the selector')
      } else {
        await page.waitForTimeout(500)
        assert.equal(await page.evaluate(() => window.destinationMotionEvents.length), 0, 'No destination animation on mobile or reduced-motion')
      }
      if (mobile) await open()
      const geometry = await page.locator(`${selector} .site-destinations`).evaluate((nav) => {
        const active = nav.querySelector('[aria-current="page"]').getBoundingClientRect()
        const pill = nav.querySelector('.site-destination-indicator').getBoundingClientRect()
        return { x: Math.abs(pill.x - active.x), width: Math.abs(pill.width - active.width) }
      })
      assert.ok(geometry.x < 1.1 && geometry.width < 1.1)
      await page.evaluate(() => { window.destinationMotionEvents.length = 0 })
    }
    await open()
    await page.locator(selector).getByRole('link', { name: 'Portfolio', exact: true }).click()
    await verify('/portfolio')
    await page.locator(selector).getByRole('link', { name: 'Web principal', exact: true }).click()
    await verify('/')
    if (!mobile) {
      await page.goBack()
      await verify('/portfolio')
      await page.goForward()
      await verify('/')
    }
    assert.deepEqual(errors, [])
    console.log(`PASS ${width}px ${theme}/${reducedMotion}: completed motion, geometry, round trip${mobile ? ', no mobile animation' : ', back/forward'}`)
    await page.close()
  }
} finally { await browser.close() }
