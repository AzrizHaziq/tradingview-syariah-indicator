// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace TSI {
  export interface SHARIAH_LIST {
    updatedAt: Date | string
    list: ITEM
  }

  export type ITEM = Record<string, { s: 0 | 1 }>

  export interface Flag {
    id: string | 'MYX'
    src: string
    alt: string
    width: string
    height: string
    displayUrl: string
    updatedAt: Date | string
  }

  export type EVENT_MSG =
    | {
        type: 'ga'
        subType: 'pageview'
        payload: string
      }
    | {
        type: 'ga'
        subType: 'event'
        payload: {
          eventCategory: string
          eventAction: string
          eventLabel?: string
        }
      }
    | {
        type: 'invalidate-cache'
      }
}
