import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Ponda | Shankarajyothi',
  description: 'Ponda, Goa — major temple visits including Mahalasa Narayani, Shantadurga, and Mangeshi temples.',
}

export default async function PondaPage() {
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-ponda-goa' } },
    limit: 1,
  })
  const location = locationResult.docs[0] as Location | undefined

  let relatedExpeditions: Expedition[] = []
  if (location) {
    const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
    relatedExpeditions = expResult.docs.filter((exp) =>
      exp.itinerary?.some((stop) => {
        const loc = stop.location as Location | number
        return typeof loc === 'object' ? loc.id === location.id : loc === location.id
      }),
    )
  }

  const placesOfInterest = [
    {
      icon: '🛕',
      name: 'Shri Mahalasa Narayani Temple, Mardol',
      desc: 'One of the most revered temples in Goa, dedicated to Goddess Mahalasa — a form of Mohini/Vishnu. The idol was relocated here from Verna during the Portuguese era.',
    },
    {
      icon: '🙏',
      name: 'Shri Shantadurga Temple, Kavlem',
      desc: 'Dedicated to Goddess Shantadurga, the deity who mediated between Vishnu and Shiva. One of the most visited temples in Goa.',
    },
    {
      icon: '🕉️',
      name: 'Shri Mangeshi Temple, Mangeshi',
      desc: 'The largest and most popular temple in Goa, dedicated to Lord Mangesh (Shiva). A fine example of Goan Hindu temple architecture with a distinctive deepastambha.',
    },
    {
      icon: '🏚️',
      name: 'Rivona Caves',
      desc: 'Ancient rock-cut caves near Rivona, believed to be Buddhist and later Hindu monastic cells. Includes the Vimaleshwara temple site.',
    },
    {
      icon: '🗿',
      name: 'Arvalem Caves & Waterfalls',
      desc: 'Rock-cut caves at Arvalem (Harvalem) with Shiva lingas inside, dating to the 5th–6th century. The nearby Arvalem waterfall is a scenic landmark.',
    },
    {
      icon: '🌿',
      name: 'Bicholim & South Goa',
      desc: 'Visits to Bicholim, Chandur, and South Goa — exploring the broader cultural and temple landscape of the region, including the Rureshwar Colony.',
    },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Ponda'}</h1>
        <p className="location-desc">
          The temple town of Goa — home to some of the most important Hindu temples, preserved here after being relocated from Portuguese-controlled territories in the 16th century.
        </p>
        {relatedExpeditions.length > 0 && (
          <div className="hero-yatra-badges">
            {relatedExpeditions.map((exp) => {
              const stop = exp.itinerary?.find((s) => {
                const loc = s.location as Location | number
                return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id
              })
              return (
                <Link href="/expedition" key={exp.id} className="hero-yatra-badge">
                  <span>🕉️</span>
                  <span className="hero-yatra-badge-title">{exp.title}</span>
                  {stop?.arrivalDate && stop?.departureDate && (
                    <span className="hero-yatra-badge-dates">
                      {new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {' – '}
                      {new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  <span className="hero-yatra-badge-arrow">→</span>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <hr className="section-divider" />

      <div className="location-section">
        <h2 className="location-section-heading">Places of Interest</h2>
        <div className="poi-grid">
          {placesOfInterest.map((poi) => (
            <div className="poi-card" key={poi.name}>
              <div className="poi-icon">{poi.icon}</div>
              <h3>{poi.name}</h3>
              <p>{poi.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="location-footer">
        <p>An initiative of <span className="org-name">Vedanta Bharati</span></p>
        <p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p>
      </footer>
    </>
  )
}
