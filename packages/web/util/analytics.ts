import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

export const analytics = Analytics({
  app: 'tradingview shariah indicator web',
  debug: import.meta.env.MODE === 'development',
  plugins: [googleAnalytics({ trackingId: import.meta.env.VITE_GA })],
})

export const trackOnLoad: typeof analytics.page = async (...args) => {
  await analytics.page(...args)
}

export interface EventMap {
  referrer_code: { category: 'web::referrer_code'; label: string }
}

export async function trackEvent<K extends keyof EventMap>(eventName: K, props: EventMap[K]): Promise<void> {
  await analytics.track(eventName, props)
}
