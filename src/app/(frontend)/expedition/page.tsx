import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location } from '@/payload-types'
import ExpeditionMapWrapper from './ExpeditionMapWrapper'
import './map.css'

export const metadata = {
  title: 'Expedition Map | Shankarajyoti',
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
  'loc-nashik': '/location/nashik',
  'loc-surat': '/location/surat',
  'loc-vadodara': '/location/vadodara',
  'loc-bhavnagar': '/location/bhavnagar',
  'loc-somnath': '/location/somnath',
  'loc-junagadh': '/location/junagadh',
  'loc-dwarka': '/location/dwarka',
  'loc-jamnagar': '/location/jamnagar',
  'loc-bhuj': '/location/bhuj',
  'loc-ahmedabad': '/location/ahmedabad',
  'loc-mount-abu': '/location/mount-abu',
  'loc-udaipur': '/location/udaipur',
  'loc-jalore': '/location/jalore',
  'loc-barmer': '/location/barmer',
  'loc-jaisalmer': '/location/jaisalmer',
  'loc-bikaner': '/location/bikaner',
  'loc-jodhpur': '/location/jodhpur',
  'loc-ajmer': '/location/ajmer',
  'loc-jaipur': '/location/jaipur',
  'loc-kota': '/location/kota',
  'loc-rohtak': '/location/rohtak',
  'loc-kurukshetra': '/location/kurukshetra',
  'loc-chandigarh': '/location/chandigarh',
  'loc-ludhiana': '/location/ludhiana',
  'loc-amritsar': '/location/amritsar',
  'loc-srinagar': '/location/srinagar',
  'loc-anantnag': '/location/anantnag',
  'loc-belavadi': '/location/belavadi',
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

      <div className="map-wrapper">
        <ExpeditionMapWrapper expedition={expedition} />
      </div>
    </div>
  )
}
