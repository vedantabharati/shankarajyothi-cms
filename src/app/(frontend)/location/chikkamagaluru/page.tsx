import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Chikkamagaluru | Shankarajyothi',
  description: 'Chikkamagaluru — Belvadi and Hiremagaluru visits on the Shaankara Jyothi Prakasha yatra.',
}

export default async function ChikkamagaluruPage() {
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-chk-01' } },
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
      name: 'Belvadi',
      desc: 'An ancient village known for the Veeranarayana Temple, a remarkable example of Hoysala architecture dating back to the 12th century.',
    },
    {
      icon: '🏛️',
      name: 'Hiremagaluru',
      desc: 'A historically significant settlement in the Chikkamagaluru region with connections to the broader cultural landscape of the Malnad area.',
    },
    {
      icon: '⛰️',
      name: 'ChandradronaParvata',
      desc: 'The mountain associated with the legend of Chandra (the moon god) performing penance. The town of Chikkamagaluru derives its cultural heritage from this sacred geography.',
    },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Chikkamagaluru'}</h1>
        <p className="location-desc">
          A historically and spiritually significant district in Karnataka&apos;s Western Ghats — home to the Sringeri Sharada Peetham, the first monastic institution established by Adi Shankaracharya.
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
              Chikkamagaluru district holds foundational significance in the legacy of Adi Shankaracharya. It is here, at <strong>Sringeri</strong> on the banks of the Tunga river, that the Acharya established the <strong>Sringeri Sharada Peetham</strong> — the first of the four cardinal <em>mathas</em> (monastic institutions) he founded to preserve and propagate Sanatana Dharma and Advaita Vedanta. According to tradition, Adi Shankaracharya chose Sringeri after witnessing a cobra shading a pregnant frog from the midday sun — a sign of the extraordinary sanctity of the place. He installed a sandalwood image of Goddess Sharadamba and appointed his senior disciple Sri Sureshvaracharya as the first pontiff.
            </p>
            <span className="citation">
              <strong>Source:</strong> Traditional accounts preserved at <em>Sringeri Sharada Peetham</em> (sringeri.net); documented in the <em>Shankaravijaya</em> literature and referenced in the Peetham&apos;s official institutional history.
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
