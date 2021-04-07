declare module TSI {
  export interface SHARIAH_LIST {
    updatedAt: Date | string
    list: ITEM
  }

  export type ITEM = Record<string, { s: 0 | 1 }>

  export type EVENT_MSG =
    | {
        type: 'ga'
        subType: 'pageview' | 'event'
        payload: any
      }
    | {
        type: 'invalidate-cache'
      }
}
