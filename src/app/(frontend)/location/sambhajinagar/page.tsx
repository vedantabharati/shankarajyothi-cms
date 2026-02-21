import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Chhatrapati Sambhajinagar | Shankarajyothi',
  description: 'Chhatrapati Sambhajinagar — Grishneshwar Jyotirlinga and Ashwalayana Ghat on the yatra.',
}

export default async function SambhajinagarPage() {
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-sambaji-01' } },
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
      icon: '🔱',
      name: 'Grishneshwar Jyotirlinga',
      desc: 'One of the twelve sacred Jyotirlingas of Lord Shiva, located near the Ellora Caves. The current temple structure was built by Queen Ahilyabai Holkar in the 18th century. The temple is referenced in the Shiva Purana.',
    },
    {
      icon: '🌊',
      name: 'Ashwalayana Ghat',
      desc: 'A sacred ghat associated with the Ashwalayana Shakha tradition — an important site for ritual and scholarly engagement on the yatra.',
    },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Chhatrapati Sambhajinagar'}</h1>
        <p className="location-desc">
          Home to the Grishneshwar Jyotirlinga and the UNESCO World Heritage Ellora Caves — a major stop in Maharashtra&apos;s Marathwada region.
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

      <div className="shankaracharya-section">
        <div className="location-section">
          <h2 className="location-section-heading">Connection to Adi Shankaracharya</h2>
          <div className="shankaracharya-content">
            <p>
              The Grishneshwar Jyotirlinga is explicitly named in the <strong>Dwadasa Jyotirlinga Stotram</strong>, a hymn attributed to Adi Shankaracharya that enumerates and glorifies the twelve principal Jyotirlingas of Lord Shiva. The stotram&apos;s inclusion of Grishneshwar attests to the shrine&apos;s recognised spiritual pre-eminence within the Shankarite tradition and the broader Shaivite pilgrimage framework.
            </p>
            <span className="citation">
              <strong>Source:</strong> Dwadasa Jyotirlinga Stotram, attributed to Adi Shankaracharya; preserved in stotra compilations and referenced in Hindupedia and other scholarly sources on the Jyotirlinga tradition.
            </span>
          </div>
        </div>
      </div>

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
