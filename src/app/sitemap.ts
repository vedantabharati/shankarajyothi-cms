import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Location, Expedition } from '@/payload-types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shaankarajyoti.vedantabharati.org'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [locationResult, expeditionResult] = await Promise.all([
    payload.find({ collection: 'locations', limit: 500, depth: 0 }),
    payload.find({ collection: 'expeditions', limit: 50, depth: 2 }),
  ])

  const locations = locationResult.docs as Location[]
  const expeditions = expeditionResult.docs as Expedition[]

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/location`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE_URL}/expedition`, priority: 0.9, changeFrequency: 'daily' },
  ]

  // One page per location that has a qrSlug
  const locationRoutes: MetadataRoute.Sitemap = locations
    .filter((loc) => !!loc.qrSlug)
    .map((loc) => ({
      url: `${BASE_URL}/location/${loc.qrSlug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    }))

  // One page per expedition stop (main + satellite)
  const stopRoutes: MetadataRoute.Sitemap = expeditions.flatMap((exp) =>
    (exp.itinerary ?? []).flatMap((item) => {
      const mainLoc = typeof item.location === 'object' ? (item.location as Location) : null
      const routes: MetadataRoute.Sitemap = []

      if (mainLoc?.qrSlug) {
        routes.push({
          url: `${BASE_URL}/expedition/${exp.id}/stop/${mainLoc.qrSlug}`,
          priority: 0.8,
          changeFrequency: 'weekly' as const,
        })
      }

      for (const sat of item.satelliteLocations ?? []) {
        const satLoc = typeof sat.location === 'object' ? (sat.location as Location) : null
        if (satLoc?.qrSlug) {
          routes.push({
            url: `${BASE_URL}/expedition/${exp.id}/stop/${satLoc.qrSlug}`,
            priority: 0.7,
            changeFrequency: 'weekly' as const,
          })
        }
      }

      return routes
    })
  )

  return [...staticRoutes, ...locationRoutes, ...stopRoutes]
}
