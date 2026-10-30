export type DestinationSelection = { locationKey: string; destination: string; origin: string }

/** Outgoing and incoming headers can both render the same router location.
 * Reuse that transition's origin instead of consuming it in the outgoing tree.
 * Also makes StrictMode's layout-effect replay independent of frame timing. */
export function resolveDestinationSelection(previous: DestinationSelection | undefined, destination: string, locationKey: string): DestinationSelection {
  if (previous?.locationKey === locationKey && previous.destination === destination) return previous
  return { locationKey, destination, origin: previous?.destination ?? destination }
}
