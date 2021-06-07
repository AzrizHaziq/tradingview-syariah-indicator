// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace TSI {
  /////////////////////////// RESPONSE_FROM_JSON ///////////////////////////////////
  type SHAPE_SHARIAH = {
    0: 'non-s'
    1: 's'
    default: string
  }

  type SHAPE_DUMMY = {
    0: 'nothing'
    abc: 'dummy'
    default: string
  }

  type SHAPE = SHAPE_SHARIAH | SHAPE_DUMMY
  type KEYOF_SHAPE = keyof SHAPE_SHARIAH | keyof SHAPE_DUMMY

  export type Exchanges = 'MYX'

  export interface ExchangesDetail {
    updatedAt: string
    shape: SHAPE[]
    list: Record<string, KEYOF_SHAPE[]>
  }

  type RESPONSE_FROM_JSON = Record<Exchanges, ExchangesDetail>
  /////////////////////////// RESPONSE_FROM_JSON ///////////////////////////////////
  export interface StorageMap {
    DETAILS: Flag[]
    LIST: any
    LAST_FETCH_AT: string
    IS_FILTER_SHARIAH: boolean
  }

  export interface Flag {
    id: string | 'MYX'
    updatedAt: string
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
