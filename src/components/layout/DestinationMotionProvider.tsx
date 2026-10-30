import { createContext, useContext, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import type { DestinationSelection } from './destinationMotion'

// The header belongs to each page. Keep only its last selection across route
// remounts so the pill can travel from the previous destination, not fade in.
const DestinationMotionContext = createContext<RefObject<Map<string, DestinationSelection>> | null>(null)

export function DestinationMotionProvider({ children }: { children: ReactNode }) {
  const selections = useRef(new Map<string, DestinationSelection>())
  return <DestinationMotionContext.Provider value={selections}>{children}</DestinationMotionContext.Provider>
}

export function useDestinationMotion() {
  return useContext(DestinationMotionContext)
}
