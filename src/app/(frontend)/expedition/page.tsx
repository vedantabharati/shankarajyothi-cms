import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location } from '@/payload-types'
import ExpeditionMapWrapper from './ExpeditionMapWrapper'
import { formatLongDate } from '@/utils/date'
import './map.css'

// Next.js Route Segment Config: Re-fetch expedition data and regenerate the page every 60 seconds
// This ensures CMS updates (like adding new satellite locations) appear without needing a fresh build.
export const revalidate = 60

export const metadata = {
  title: 'Expedition Map | Shankarajyoti',
  description: 'Track the West-North India Digvijaya 2025 expedition route across sacred temples',
}


export default async function ExpeditionPage() {
  const payload = await getPayload({ config })

  // Fetch expedition with populated location relationships
  const expeditions = await payload.find({
    collection: 'expeditions',
    depth: 3, // Populate location relationships, including nested satellite locations
    limit: 1,
  })

  const expedition = expeditions.docs[0]

  if (!expedition) {
    return (
      <div className="expedition-container">
        <div className="expedition-header">
          <h1>No Expedition Found</h1>
          <p>Please seed the database with expedition data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="expedition-container">
      <div className="expedition-header">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{expedition.title}</h1>
        <p>{expedition.summary}</p>
        {expedition.startDate && expedition.endDate && (
          <div className="expedition-dates">
            <span>
              {formatLongDate(expedition.startDate)}
            </span>
            {' → '}
            <span>
              {formatLongDate(expedition.endDate)}
            </span>
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <ExpeditionMapWrapper expedition={expedition} />
      </div>
    </div>
  )
}
