export type ScrapeResult = {
    [exchange: string]: {
      stocks: {code: string, name: string}[],
      updatedAt: Date,
      market: string
    }
  }