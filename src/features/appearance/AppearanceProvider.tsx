import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AppearanceContext } from './context'
import { getAtmospherePosition, getDayPeriod } from './model'
import type { Atmosphere, SolarMode, Theme } from './model'

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('portfolio-theme') as Theme) || 'system')

  const [solarMode, setSolarMode] = useState<SolarMode>(() => (localStorage.getItem('portfolio-solar-mode') as SolarMode) || 'auto')

  const [localTime, setLocalTime] = useState(() => new Date())

  const dayPeriod = getDayPeriod(localTime)

  const atmosphere: Atmosphere = solarMode === 'auto' ? dayPeriod : solarMode

  const greeting = dayPeriod === 'morning' ? 'buenos días' : dayPeriod === 'afternoon' ? 'buenas tardes' : 'buenas noches'

  const formattedTime = localTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('portfolio-solar-mode', solarMode)
  }, [solarMode])

  useEffect(() => {
    const position = getAtmospherePosition(localTime, atmosphere)
    document.documentElement.dataset.atmosphere = atmosphere
    document.documentElement.style.setProperty('--celestial-right', `${position.right}vw`)
    document.documentElement.style.setProperty('--celestial-top', `${position.top}%`)
  }, [atmosphere, localTime])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    const syncBrowserTheme = () => {
      const darkTheme = theme === 'dark' || (theme === 'system' && systemTheme.matches)
      document.documentElement.dataset.appearance = darkTheme ? 'dark' : 'light'
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', darkTheme ? '#000000' : '#ffffff')
    }
    syncBrowserTheme()
    if (theme === 'system') systemTheme.addEventListener('change', syncBrowserTheme)
    return () => systemTheme.removeEventListener('change', syncBrowserTheme)
  }, [theme])

  return <AppearanceContext.Provider value={{ theme, setTheme, solarMode, setSolarMode, localTime, formattedTime, greeting, atmosphere }}>{children}</AppearanceContext.Provider>
}
