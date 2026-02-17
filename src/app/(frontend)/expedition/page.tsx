import { getPayload } from 'payload'
import config from '@/payload.config'
import ExpeditionMap from './ExpeditionMap'
import './map.css'

export const metadata = {
  title: 'Expedition Map | Shankarajyothi',
  description: 'Track the West-North India Digvijaya 2025 expedition route across sacred temples',
}

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
        <h1>{expedition.title}</h1>
        <p>{expedition.summary}</p>
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
      </div>

      <ExpeditionMap expedition={expedition} />
    </div>
  )
}
