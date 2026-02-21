import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Nashik | Shankarajyothi',
  description: 'Nashik — Trimbakeshwar Jyotirlinga, Panchavati, and Kapaleshwar Temple.',
}

export default async function NashikPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-nashik' } }, limit: 1 })
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
    { icon: '🔱', name: 'Trimbakeshwar Jyotirlinga', desc: 'One of the twelve Jyotirlingas of Lord Shiva, situated at the source of the Godavari river near the Brahmagiri mountain.' },
    { icon: '🛕', name: 'Panchavati', desc: 'The sacred area where Lord Rama, Sita, and Lakshmana are believed to have resided during their exile. Home to the Kalaram Temple.' },
    { icon: '🙏', name: 'Kapaleshwar Temple', desc: 'An ancient Shiva temple in Nashik, one of the oldest temples in the region with significant architectural and historical value.' },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Nashik'}</h1>
        <p className="location-desc">
          A sacred city on the banks of the Godavari — home to the Trimbakeshwar Jyotirlinga and the holy Panchavati area associated with the Ramayana.
        </p>
        {relatedExpeditions.length > 0 && (
          <div className="hero-yatra-badges">
            {relatedExpeditions.map((exp) => {
              const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id })
              return (
                <Link href="/expedition" key={exp.id} className="hero-yatra-badge">
                  <span>🕉️</span>
                  <span className="hero-yatra-badge-title">{exp.title}</span>
                  {stop?.arrivalDate && stop?.departureDate && (
                    <span className="hero-yatra-badge-dates">
                      {new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
              Trimbakeshwar is explicitly named in the <strong>Dwadasa Jyotirlinga Stotram</strong> attributed to Adi Shankaracharya. The stotram glorifies the twelve principal Jyotirlingas of Lord Shiva, and Trimbakeshwar&apos;s inclusion attests to its recognised pre-eminence within the Shankarite Shaivite tradition.
            </p>
            <span className="citation">
              <strong>Source:</strong> Dwadasa Jyotirlinga Stotram, attributed to Adi Shankaracharya; preserved in traditional stotra compilations.
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
