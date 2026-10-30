const legacyPortfolioHashes = new Set(['#proyectos', '#experiencia', '#habilidades', '#sobre-mi'])

/** Compatibility only at the entry point; URL fragments are not sent in loader requests. */
export function getLegacyPortfolioDestination(pathname: string, hash: string, search = '') {
  return pathname === '/' && legacyPortfolioHashes.has(hash) ? '/portfolio' + search + hash : null
}
