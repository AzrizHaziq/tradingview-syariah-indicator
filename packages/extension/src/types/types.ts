// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace TSI {
  type SHAPE_SHARIAH = {
    0: 'non-s'
    1: 's'
    default: string
  }

  type Exchanges = 'MYX'

  export interface ExchangesDetail {
    updatedAt: string
    shape: SHAPE_SHARIAH[]
    list: ITEM
  }

  type RESPONSE_FROM_JSON = Record<Exchanges, ExchangesDetail>

  /////////////////////////// STORAGE ///////////////////////////////////
  export const enum StorageKeys {
    DETAILS = 'DETAILS',
    LIST = 'LIST',
  }

  export type StorageKey = { key: StorageKeys.DETAILS; payload: Flag[] } | { key: StorageKeys.LIST; payload: any }

  /////////////////////////////////////////////////////////////

  export type ITEM = Record<string, { s: 0 | 1 }>

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
