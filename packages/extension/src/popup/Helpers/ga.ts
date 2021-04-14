export function popupGa(eventAction: string, eventLabel: string): void {
  ga('send', {
    hitType: 'event',
    eventCategory: 'popup',
    eventAction,
    eventLabel,
  })
}

export const _popupGa = (eventAction: string, eventLabel: string) => () => popupGa(eventAction, eventLabel)
