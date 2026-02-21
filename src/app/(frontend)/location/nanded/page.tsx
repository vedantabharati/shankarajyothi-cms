import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = {
  title: 'Nanded | Shankarajyothi',
  description: 'Nanded — Kalleshwara, Vimaleshwara, and Nagnath Jyotirlinga on the Shaankara Jyothi Prakasha yatra.',
}

export default async function NandedPage() {
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: 'loc-nanded' } },
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
      icon: '🕉️',
      name: 'Kalleshwara Temple, Visnupuri',
      desc: 'An ancient Shiva temple at Visnupuri near Nanded, part of the region\'s rich network of Shaivite shrines.',
    },
    {
      icon: '🛕',
      name: 'Vimaleshwara Temple, Maralak',
      desc: 'A Shiva temple at Maralak, visited as part of the cultural exploration of Nanded\'s temple landscape.',
    },
    {
      icon: '📜',
      name: 'Stotra Samarpane',
      desc: 'A program of stotra recitation and offering, connecting the yatra\'s scholarly mission with local devotional traditions.',
    },
    {
      icon: '🔱',
      name: 'Aundha Nagnath Jyotirlinga',
      desc: 'One of the twelve Jyotirlingas of Lord Shiva, located at Aundha in the Nanded region. The temple is believed to have ancient origins and was later renovated by Rani Ahilyabai Holkar.',
    },
  ]

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Nanded'}</h1>
        <p className="location-desc">
          A multi-day halt in Maharashtra&apos;s Marathwada region — visiting ancient Shaivite shrines and the Aundha Nagnath Jyotirlinga.
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
              The Nanded region&apos;s connection to Adi Shankaracharya is primarily through the <strong>Aundha Nagnath Jyotirlinga</strong>. In the <strong>Dwadasa Jyotirlinga Stotram</strong>, a hymn attributed to Adi Shankaracharya that enumerates and glorifies the twelve principal Jyotirlingas, &ldquo;Naganatha&rdquo; is invoked — traditionally identified with the Aundha Nagnath temple. This inclusion attests to the shrine&apos;s recognised spiritual importance within the Shankarite tradition.
            </p>
            <span className="citation">
              <strong>Source:</strong> Dwadasa Jyotirlinga Stotram, attributed to Adi Shankaracharya; widely preserved in stotra compilations and referenced in commentarial literature on the Jyotirlinga tradition.
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
