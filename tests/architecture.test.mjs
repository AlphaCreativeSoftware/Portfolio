import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'

const root = fileURLToPath(new URL('../src/', import.meta.url))

test('local module graph has no cycles and shared code does not depend on features/pages', async () => {
  const files = (await readdir(root, { recursive: true })).filter((file) => /\.tsx?$/.test(file) && !file.endsWith('.d.ts'))
  const graph = new Map()
  for (const relative of files) {
    const file = path.join(root, relative)
    const source = ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true)
    const imports = source.statements.filter(ts.isImportDeclaration).map((node) => node.moduleSpecifier.text)
    const dependencies = imports.filter((specifier) => specifier.startsWith('.')).map((specifier) => {
      if (specifier.endsWith('.css')) {
        const resolved = path.resolve(path.dirname(file), specifier)
        assert.ok(existsSync(resolved), `Missing stylesheet: ${specifier}`)
        return resolved
      }
      const resolved = ts.resolveModuleName(specifier, file, { moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX }, ts.sys).resolvedModule?.resolvedFileName
      assert.ok(resolved, `Unresolved local import: ${relative} -> ${specifier}`)
      return path.normalize(resolved)
    })
    if (relative.replaceAll('\\', '/').startsWith('shared/')) {
      for (const dependency of dependencies) assert.ok(dependency.startsWith(path.join(root, 'shared') + path.sep), `Shared code depends on a feature: ${relative}`)
    }
    if (relative.replaceAll('\\', '/').startsWith('features/appearance/')) {
      for (const dependency of dependencies) assert.ok(!dependency.includes(path.join('features', 'portfolio')), `Appearance depends on portfolio: ${relative}`)
    }
    graph.set(path.normalize(file), dependencies)
  }
  const complete = new Set()
  const visit = (file, trail) => {
    assert.ok(!trail.includes(file), `Circular import: ${[...trail, file].map((value) => path.relative(root, value)).join(' -> ')}`)
    if (complete.has(file)) return
    for (const dependency of graph.get(file) ?? []) visit(dependency, [...trail, file])
    complete.add(file)
  }
  for (const file of graph.keys()) visit(file, [])
})

test('style entry point contains only ordered imports and all target files exist', async () => {
  const css = await readFile(path.join(root, 'styles.css'), 'utf8')
  const imports = [...css.matchAll(/@import\s+['"](.+?)['"];?/g)]
  assert.ok(imports.length > 0)
  assert.equal(css.replace(/@import\s+['"](.+?)['"];?/g, '').trim(), '')
  assert.equal(new Set(imports.map((match) => match[1])).size, imports.length)
  for (const match of imports) assert.ok((await readFile(path.resolve(root, match[1]), 'utf8')).trim())
})

test('the existing typefaces are local WOFF2 assets with their licenses', async () => {
  for (const name of ['dm-sans-latin', 'dm-sans-latin-ext', 'manrope-latin', 'manrope-latin-ext']) {
    const font = await readFile(new URL('../public/fonts/' + name + '.woff2', import.meta.url))
    assert.equal(font.subarray(0, 4).toString(), 'wOF2')
  }
  for (const name of ['DM-Sans-OFL.txt', 'Manrope-OFL.txt']) assert.match(await readFile(new URL('../public/fonts/' + name, import.meta.url), 'utf8'), /SIL OPEN FONT LICENSE/)
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
  assert.ok(!html.includes('fonts.googleapis.com'))
  assert.match(html, /preload.*\/fonts\/manrope-latin\.woff2/)
})
