// declare function ga(...args: unknown[]): void

declare module "*.svg";

declare namespace TSI {
  /////////////////////////// RESPONSE_FROM_JSON ///////////////////////////////////
  type SHAPE_SHARIAH = {
    0: "non-s";
    1: "s";
    default: string;
  };

  type SHAPE_DUMMY = {
    0: "nothing";
    abc: "dummy";
    default: string;
  };

  type SHAPE = SHAPE_SHARIAH | SHAPE_DUMMY;
  type KEYOF_SHAPE = keyof (SHAPE_SHARIAH | SHAPE_DUMMY);

  export type Exchanges = "MYX" | "NASDAQ" | "NYSE" | "AMAX" | "OTC";

  export interface ExchangesDetail {
    updatedAt: string;
    shape: SHAPE[];
    list: Record<string, KEYOF_SHAPE[]>;
  }

  type RESPONSE_FROM_JSON = Record<Exchanges, ExchangesDetail>;
  /////////////////////////// RESPONSE_FROM_JSON ///////////////////////////////////
  export interface StorageMap {
    DETAILS: Flag[];
    LIST: [`${string}:${string}`, Record<string, number>][];
    LAST_FETCH_AT: string;
    IS_FILTER_SHARIAH: boolean;
  }

  export interface Flag {
    id: string | "MYX";
    updatedAt: string;
    counts: number;
  }

  export type EVENT_MSG =
    | {
        type: "ga";
        subType: "pageview";
        payload: string;
      }
    | {
        type: "ga";
        subType: "event";
        payload: {
          eventCategory: string;
          eventAction: string;
          eventLabel?: string;
        };
      }
    | { type: "invalidate-cache" }
    | {
        type: "ga-popup";
        subType: "pageview" | "event"; // this should look the same as above ga
        payload:
          | string
          | {
              eventCategory: string;
              eventAction: string;
              eventLabel?: string;
            };
      };
}
