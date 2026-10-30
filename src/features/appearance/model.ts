export type Theme = 'system' | 'light' | 'dark'

export type DayPeriod = 'morning' | 'afternoon' | 'night'

export type Atmosphere = DayPeriod

export type SolarMode = 'auto' | DayPeriod

export function getDayPeriod(date: Date): DayPeriod {
  const minutes = date.getHours() * 60 + date.getMinutes()
  if (minutes >= 20 * 60 + 30 || minutes < 5 * 60) return 'night'
  if (minutes < 12 * 60) return 'morning'
  return 'afternoon'
}

export function getAtmospherePosition(date: Date, atmosphere: Atmosphere) {
  const minutes = date.getHours() * 60 + date.getMinutes()
  if (atmosphere === 'night' && getDayPeriod(date) !== 'night') return { right: 8, top: 20 }

  const start = atmosphere === 'night' ? 20 * 60 + 30 : 5 * 60
  const duration = atmosphere === 'night' ? 8.5 * 60 : 15.5 * 60
  const elapsed = atmosphere === 'night' && minutes < 5 * 60 ? minutes + 24 * 60 - start : minutes - start
  const progress = Math.min(1, Math.max(0, elapsed / duration))
  const elevation = Math.sin(progress * Math.PI)
  return {
    right: 4 + (1 - progress) * 9,
    top: 16 + (1 - elevation) * 16,
  }
}

export const solarModeLabels: Record<SolarMode, string> = {
  auto: 'Automático',
  morning: 'Mañana',
  afternoon: 'Tarde',
  night: 'Noche',
}
