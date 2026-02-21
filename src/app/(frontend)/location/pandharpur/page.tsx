import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Pandharpur | Shankarajyothi',
  description:
    'Pandharpur — sacred Vitthal temple town on the Shaankara Jyothi Prakasha yatra route.',
}

export default async function PandharpurPage() {
  const payload = await getPayload({ config })

  /* ── Fetch location from DB ── */
  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-pandharpur' } },
    limit: 1,
  })
  const location = locationResult.docs[0] as Location | undefined

  /* ── Fetch expeditions that include this location ── */
  let relatedExpeditions: Expedition[] = []
  if (location) {
    const expResult = await payload.find({
      collection: 'expeditions',
      depth: 2,
      limit: 10,
    })
    relatedExpeditions = expResult.docs.filter((exp) =>
      exp.itinerary?.some((stop) => {
        const loc = stop.location as Location | number
        return typeof loc === 'object' ? loc.id === location.id : loc === location.id
      }),
    )
  }

  /* ── Hardcoded: Places of Interest ── */
  const placesOfInterest = [
    {
      icon: '🛕',
      name: 'Shri Vitthal-Rukmini Temple',
      desc: 'The principal temple of Pandharpur, enshrining Lord Vitthal (Panduranga) and Goddess Rukmini. A major Vaishnava pilgrimage centre and the heart of the Varkari tradition.',
    },
    {
      icon: '🙏',
      name: 'Pundalik Temple',
      desc: 'Dedicated to the devoted son Pundalik, whose devotion is said to have drawn Lord Vitthal to Pandharpur. Located near the Chandrabhaga riverbank.',
    },
    {
      icon: '🌊',
      name: 'Chandrabhaga River Ghat',
      desc: 'The sacred river ghat where pilgrims take a ritual bath before visiting the Vitthal temple. A site of great spiritual significance during Ashadhi and Kartiki Ekadashi.',
    },
  ]

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Pandharpur'}</h1>
        <p className="location-desc">
          {location
            ? 'Sacred Vitthal temple town on the banks of the Chandrabhaga river in Maharashtra — one of the most revered pilgrimage centres in the Bhakti tradition.'
            : 'Loading location data…'}
        </p>

        {/* Compact yatra badge */}
        {relatedExpeditions.length > 0 && (
          <div className="hero-yatra-badges">
            {relatedExpeditions.map((exp) => {
              const stop = exp.itinerary?.find((s) => {
                const loc = s.location as Location | number
                return typeof loc === 'object'
                  ? loc.id === location?.id
                  : loc === location?.id
              })
              return (
                <Link href="/expedition" key={exp.id} className="hero-yatra-badge">
                  <span>🕉️</span>
                  <span className="hero-yatra-badge-title">{exp.title}</span>
                  {stop?.arrivalDate && stop?.departureDate && (
                    <span className="hero-yatra-badge-dates">
                      {new Date(stop.arrivalDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' – '}
                      {new Date(stop.departureDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
              Pandharpur&apos;s association with Adi Shankaracharya is attested primarily through the{' '}
              <strong>Pandurangashtakam</strong>, a devotional hymn of eight verses attributed to
              him. The hymn praises Lord Panduranga (Vitthal) and offers a philosophical meditation
              on the deity&apos;s iconic standing posture upon a brick — interpreting it through an
              Advaitic lens. The composition reflects the Acharya&apos;s characteristic method of
              integrating Bhakti with Vedantic inquiry, and its attribution is preserved across
              multiple traditional compilations of his stotras.
            </p>

            <span className="citation">
              <strong>Source:</strong> Pandurangashtakam, attributed to Adi Shankaracharya;
              preserved in traditional compilations such as{' '}
              <em>Shankaracharya Stotra Sangraha</em> and widely referenced in commentarial
              literature on the Pandharpur tradition.
            </span>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ===== PLACES OF INTEREST ===== */}
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

      {/* ===== FOOTER ===== */}
      <footer className="location-footer">
        <p>
          An initiative of <span className="org-name">Vedanta Bharati</span>
        </p>
        <p className="tagline">
          Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya
        </p>
      </footer>
    </>
  )
}
