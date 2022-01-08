export function popupGa(eventAction: string, eventLabel: string): void
export function popupGa(options: { hitType: string; eventCategory: string; eventAction: string; eventLabel: string })
export function popupGa(eventAction: string | object, eventLabel?: string): void {
  if (typeof eventAction === 'object') ga('send', eventAction)

  ga('send', {
    hitType: 'event',
    eventCategory: 'popup',
    eventAction,
    eventLabel,
  })
}

export const _popupGa = (eventAction: string, eventLabel: string) => () => popupGa(eventAction, eventLabel)
