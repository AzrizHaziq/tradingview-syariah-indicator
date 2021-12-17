export type PageProps = {
  data: [exchange: string, code: string, name: string][]
  metadata: Record<string, Date>
  exchangesList: string[]
  queryParams: Partial<{
    q: string
    exchange: string | string[]
  }>
}
