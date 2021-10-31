import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

console.log(import.meta.env.MODE === 'development', 11)
export const analytics = Analytics({
  app: 'tradingview shariah indicator web',
  debug: import.meta.env.MODE === 'development',
  plugins: [googleAnalytics({ trackingId: import.meta.env.VITE_GA })],
})

export const trackOnLoad: typeof analytics.page = async (...args) => {
  await analytics.page(...args)
}

export interface EventMap {}
export async function trackEvent<K extends keyof EventMap>(eventName: K, props: EventMap[K]): Promise<void> {
  await analytics.track(eventName, props)
}
