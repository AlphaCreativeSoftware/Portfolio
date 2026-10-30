import { useAppearance } from '../../appearance/context'
import { getAtmospherePosition } from '../../appearance/model'
import type { CSSProperties } from 'react'

const studioClock = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' })

/** A complete visual today, not a placeholder for the future portrait.
 * The stage is isolated so a scroll-driven portrait can replace the artwork
 * later without changing the hero's typography, navigation or content layout.
 */
export function HomeOrbit() {
  const { localTime, atmosphere } = useAppearance()
  const formattedTime = studioClock.format(localTime)
  const period = { morning: 'Luz de mañana', afternoon: 'Luz de tarde', night: 'Luz de noche' }[atmosphere]
  const position = getAtmospherePosition(localTime, atmosphere)
  const style = { '--orbit-sun-x': 48 + (13 - position.right) * 2.8, '--orbit-sun-y': 18 + (position.top - 16) * 1.2 } as CSSProperties

  return (
    <div className="home-orbit-stage" data-viewport-animation style={style}>
      <div className="home-orbit-art" aria-hidden="true">
        <span className="home-orbit-ring home-orbit-ring-one" />
        <span className="home-orbit-ring home-orbit-ring-two" />
        <span className="home-orbit-ring home-orbit-ring-three" />
        <span className="home-orbit-track"><span className="home-orbit-traveler"><i /></span></span>
        <span className="home-orbit-sun" />
        <span className="home-orbit-cross home-orbit-cross-one" />
        <span className="home-orbit-cross home-orbit-cross-two" />
      </div>
      <div className="home-orbit-coordinate">
        <span className="home-location-dot" />
        <span>Madrid, España</span>
        <time dateTime={localTime.toISOString()}>{formattedTime}</time>
      </div>
      <p className="home-orbit-period"><span />{period}</p>
      <span className="home-orbit-signature" aria-hidden="true">Mikael Rodríguez · Software & producto</span>
    </div>
  )
}
