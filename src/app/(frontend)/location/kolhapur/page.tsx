import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Kolhapur | Shankarajyothi',
  description: 'Kolhapur — Mahalakshmi Temple and cultural visits on the Shaankara Jyothi Prakasha yatra.',
}

export default async function KolhapurPage() {
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-kolhapur' } },
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
      name: 'Shri Mahalakshmi Temple',
      desc: 'One of the most sacred Shakti Peethas in India, enshrining Goddess Mahalakshmi (Ambabai). The temple dates to the 7th century and is referenced in the Skanda Purana.',
    },
    {
      icon: '🙏',
      name: 'Narsobadi (Narsobawadi)',
      desc: 'A revered pilgrimage site at the confluence of the Krishna and Panchaganga rivers, associated with the Dattatreya tradition and the saint Narasimha Saraswati.',
    },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Kolhapur'}</h1>
        <p className="location-desc">
          The city of Goddess Mahalakshmi — one of the most important Shakti Peethas in India, with a temple tradition dating back over twelve centuries.
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
              Kolhapur&apos;s Mahalakshmi Temple has historical connections to the Shankaracharya tradition. Temple records indicate that a Shankaracharya contributed to the temple&apos;s infrastructure, and the Sankeshwar Shankaracharya Matha has maintained a longstanding association with the temple. Additionally, Adi Shankaracharya is attributed with the <strong>Kanakadhara Stotram</strong>, a celebrated hymn to Goddess Lakshmi, composed to invoke Her grace — reflecting his deep engagement with Devi worship that aligns with the Mahalakshmi tradition of Kolhapur.
            </p>
            <span className="citation">
              <strong>Source:</strong> Temple records of Shri Mahalakshmi Temple, Kolhapur (shreekarveernivasini.com); Kanakadhara Stotram, attributed to Adi Shankaracharya, preserved in traditional stotra compilations.
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
