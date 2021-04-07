export type TSI_BG_MSG =
  | {
      type: 'ga'
      subType: 'pageview' | 'event'
      payload: any
    }
  | {
      type: 'invalidate-cache'
    }
