export type ScrapResult = {
    [exchange: string]: {
      stocks: {code: string, name: string}[],
      updatedAt: Date
    }
  }