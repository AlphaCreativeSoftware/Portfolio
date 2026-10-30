import { createContext, useContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Atmosphere, SolarMode, Theme } from './model'

export type AppearanceState = {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
  solarMode: SolarMode
  setSolarMode: Dispatch<SetStateAction<SolarMode>>
  localTime: Date
  formattedTime: string
  greeting: string
  atmosphere: Atmosphere
}

export const AppearanceContext = createContext<AppearanceState | null>(null)

export function useAppearance() {
  const value = useContext(AppearanceContext)
  if (!value) throw new Error('useAppearance must be used inside AppearanceProvider')
  return value
}
