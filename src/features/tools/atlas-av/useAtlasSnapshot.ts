import { useEffect, useRef, useState } from 'react'
import { atlasEndpoint, refreshInterval } from './model'
import type { AtlasSnapshot } from './model'
import { readGpsSpeeds } from './gpsSpeed'
import type { GpsHistory } from './gpsSpeed'

export function useAtlasSnapshot() {
  const [snapshot, setSnapshot] = useState<AtlasSnapshot | null>(null)
  const [now, setNow] = useState(Date.now)
  const [busy, setBusy] = useState(true)
  const [failed, setFailed] = useState(false)
  const refresh = useRef<() => void>(() => {})

  useEffect(() => {
    let controller: AbortController | null = null
    let timer: ReturnType<typeof setTimeout> | undefined
    let stopped = false
    let history: GpsHistory = new Map()
    let lastSnapshotAt = 0
    async function update() {
      if (controller || stopped || document.hidden) return
      clearTimeout(timer)
      const request = new AbortController()
      controller = request
      setBusy(true)
      try {
        const response = await fetch(atlasEndpoint, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]) })
        if (!response.ok) throw new Error('Source unavailable')
        const data = await response.json() as AtlasSnapshot
        if (!Array.isArray(data.trains) || !Number.isFinite(data.generatedAt)) throw new Error('Invalid snapshot')
        if (!stopped) {
          if (data.generatedAt >= lastSnapshotAt) {
            const reading = readGpsSpeeds(data.trains, history, Date.now())
            history = reading.history
            lastSnapshotAt = data.generatedAt
            setSnapshot({ ...data, trains: reading.trains })
          }
          setFailed(false)
        }
      } catch {
        if (!stopped) setFailed(true)
      } finally {
        controller = null
        if (!stopped) {
          setNow(Date.now())
          setBusy(false)
          timer = setTimeout(() => void update(), refreshInterval)
        }
      }
    }

    function onVisibility() {
      clearTimeout(timer)
      if (!document.hidden) {
        setNow(Date.now())
        void update()
      }
    }

    refresh.current = () => void update()
    document.addEventListener('visibilitychange', onVisibility)
    void update()
    return () => {
      stopped = true
      controller?.abort()
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { snapshot, now, busy, failed, refresh: () => refresh.current() }
}
