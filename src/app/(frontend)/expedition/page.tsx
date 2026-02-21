import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location } from '@/payload-types'
import ExpeditionMapWrapper from './ExpeditionMapWrapper'
import './map.css'

export const metadata = {
  title: 'Expedition Map | Shankarajyothi',
  description: 'Track the West-North India Digvijaya 2025 expedition route across sacred temples',
}

const SLUG_TO_PATH: Record<string, string> = {
  'loc-kr-nagar': '/location/kr-nagar',
  'loc-chk-01': '/location/chikkamagaluru',
  'loc-shimoga': '/location/shimoga',
  'loc-kumta': '/location/kumta',
  'loc-ponda-goa': '/location/ponda',
  'loc-ratnagiri': '/location/ratnagiri',
  'loc-kolhapur': '/location/kolhapur',
  'loc-sajjangad': '/location/sajjangad',
  'loc-pandharpur': '/location/pandharpur',
  'loc-solapur': '/location/solapur',
  'loc-nanded': '/location/nanded',
  'loc-ramtek': '/location/ramtek',
  'loc-karanja': '/location/karanja',
  'loc-sambaji-01': '/location/sambhajinagar',
  'loc-beed': '/location/beed',
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default async function ExpeditionPage() {
  const payload = await getPayload({ config })

  // Fetch expedition with populated location relationships
  const expeditions = await payload.find({
    collection: 'expeditions',
    depth: 2, // Populate location relationships
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
              {new Date(expedition.startDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {' → '}
            <span>
              {new Date(expedition.endDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      <ExpeditionMapWrapper expedition={expedition} />

      {/* ===== ITINERARY TABLE ===== */}
      {expedition.itinerary && expedition.itinerary.length > 0 && (
        <div className="itinerary-section">
          <h2 className="itinerary-heading">Itinerary</h2>
          <div className="itinerary-table-wrap">
            <table className="itinerary-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Location</th>
                  <th>Arrival</th>
                  <th>Departure</th>
                </tr>
              </thead>
              <tbody>
                {expedition.itinerary.map((stop, index) => {
                  const loc = typeof stop.location === 'object' ? (stop.location as Location) : null
                  const name = loc?.name ?? `Stop ${index + 1}`
                  const href = loc?.qrSlug ? SLUG_TO_PATH[loc.qrSlug] : undefined

                  return (
                    <tr key={stop.id ?? index}>
                      <td className="itinerary-num">{index + 1}</td>
                      <td>
                        {href ? (
                          <Link href={href} className="itinerary-loc-link">{name}</Link>
                        ) : (
                          <span className="itinerary-loc-name">{name}</span>
                        )}
                      </td>
                      <td>{index === 0 ? '—' : formatDate(stop.arrivalDate)}</td>
                      <td>{stop.departureDate ? formatDate(stop.departureDate) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
