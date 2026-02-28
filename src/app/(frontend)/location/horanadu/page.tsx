import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Horanadu & Kalasa | Shankarajyothi',
  description: 'Horanadu and Kalasa — sacred centres in the Western Ghats sanctified by the presence of Adi Shankaracharya.',
}

export default async function HoranaduPage() {
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-horanadu' } },
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
      name: 'Annapoorneshwari Temple, Horanadu',
      desc: 'A revered shrine dedicated to Goddess Annapoorneshwari, originally consecrated by Agastya Maharshi. Adi Shankaracharya is believed to have installed the Sri Chakra Yantra at the feet of the Goddess, reinforcing the spiritual potency of the shrine.',
    },
    {
      icon: '🏛️',
      name: 'Kalaseshwara Temple, Kalasa',
      desc: 'A sacred centre that has historically received the patronage of the Mysore Kingdom. Local tradition continues to recall the royal–monastic alignment with Sringeri Mutt as instrumental in shaping special observances at this kshetra.',
    },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Horanadu & Kalasa'}</h1>
        <p className="location-desc">
          Sacred centres in the Western Ghats — home to the Annapoorneshwari Temple and the Kalaseshwara Temple, sanctified by the divine presence of Adi Shankaracharya.
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

      {/* ===== CONNECTION TO ADI SHANKARACHARYA ===== */}
      <div className="shankaracharya-section">
        <div className="location-section">
          <h2 className="location-section-heading">Connection to Adi Shankaracharya</h2>
          <div className="shankaracharya-content">
            <p>
              According to traditional accounts and scriptural references, it is believed that Adi Shankaracharya sanctified this holy kshetra with his divine presence and stayed here for three days, blessing the devotees.
            </p>
            <p>
              Tradition further holds that the original consecration (<em>pratishtha</em>) of Goddess Annapoorneshwari was performed by Agastya Maharshi. It is also understood from scriptural sources that <strong>Adi Shankaracharya installed the Sri Chakra Yantra</strong> at the feet of the Goddess, thereby re-energising and reinforcing the spiritual potency of the shrine.
            </p>
            <p>
              Kalasa, the neighbouring sacred centre, and its revered <strong>Kalaseshwara Temple</strong> form part of an extended spiritual geography that has historically received the patronage of the Mysore Kingdom. Local tradition continues to recall this royal–monastic alignment as instrumental in shaping special observances at the Kalasa Kshetra in association with the <strong>Sringeri Mutt</strong> — a relationship that is remembered and honoured even today.
            </p>
            <p>
              Adi Shankaracharya&apos;s presence in the region is traditionally regarded as extending beyond ritual worship, encompassing efforts toward community development, institutional consolidation, and the reinforcement of dharmic social practices. Within this framework, sacred centres functioned not merely as places of devotion, but as anchors of philosophical clarity and cultural alignment, helping to guide society toward balanced and enduring spiritual foundations.
            </p>
            <span className="citation">
              <strong>Source:</strong> Traditional accounts and scriptural references; local traditions preserved in association with the <em>Sringeri Sharada Peetham</em>.
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
