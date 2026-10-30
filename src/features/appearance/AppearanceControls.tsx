import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Monitor, Moon, Sun } from 'lucide-react'
import { useAppearance } from './context'
import { solarModeLabels } from './model'
import type { SolarMode } from './model'

export function AppearanceControls() {
  const solarControlRef = useRef<HTMLDivElement>(null)

  const [solarMenuOpen, setSolarMenuOpen] = useState(false)

  useEffect(() => {
    if (!solarMenuOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!solarControlRef.current?.contains(event.target as Node)) setSolarMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSolarMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [solarMenuOpen])
  const { theme, setTheme, solarMode, setSolarMode } = useAppearance()
  return (
    <>
      <div className="theme-switcher" data-active-theme={theme} role="group" aria-label="Apariencia">
        <button className={theme === 'system' ? 'active' : ''} aria-pressed={theme === 'system'} onClick={() => setTheme('system')} title="Usar tema del dispositivo" aria-label="Tema automático"><Monitor /></button>
        <button className={theme === 'light' ? 'active' : ''} aria-pressed={theme === 'light'} onClick={() => setTheme('light')} title="Usar tema claro" aria-label="Tema claro"><Sun /></button>
        <button className={theme === 'dark' ? 'active' : ''} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')} title="Usar tema oscuro" aria-label="Tema oscuro"><Moon /></button>
      </div>
      <div className={`solar-control ${solarMenuOpen ? 'solar-control-open' : ''}`} ref={solarControlRef}>
        <button className="solar-trigger" type="button" onClick={() => setSolarMenuOpen((open) => !open)} aria-label={`Ciclo solar: ${solarModeLabels[solarMode]}`} aria-expanded={solarMenuOpen} aria-haspopup="menu" title={`Ciclo solar: ${solarModeLabels[solarMode]}`}><ChevronDown /></button>
        <div className="solar-menu" role="menu" aria-label="Ciclo solar">
          <span>Iluminación</span>
          {(Object.keys(solarModeLabels) as SolarMode[]).map((mode) => (
            <button key={mode} type="button" role="menuitemradio" aria-checked={solarMode === mode} className={solarMode === mode ? 'active' : ''} onClick={() => { setSolarMode(mode); setSolarMenuOpen(false) }}><i />{solarModeLabels[mode]}</button>
          ))}
        </div>
      </div>
    </>
  )
}
