import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Srinagar | Shankarajyothi', description: 'Srinagar — Kashmir valley, Shankaracharya Temple.' }
export default async function SrinagarPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-srinagar' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) { const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 }); relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id })) }
  const placesOfInterest = [
    { icon: '🛕', name: 'Shankaracharya Temple', desc: 'An ancient Shiva temple perched atop the Shankaracharya Hill (Gopadri/Takht-i-Sulaiman), over 1,000 feet above Srinagar. The temple dates to at least 200 BCE and is traditionally associated with Adi Shankaracharya\'s visit to Kashmir.' },
  ]
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link><Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Srinagar'}</h1>
        <p className="location-desc">The summer capital of Jammu &amp; Kashmir — home to the ancient Shankaracharya Temple atop Gopadri hill, overlooking the Dal Lake.</p>
        {relatedExpeditions.length > 0 && (<div className="hero-yatra-badges">{relatedExpeditions.map((exp) => { const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id }); return (<Link href="/expedition" key={exp.id} className="hero-yatra-badge"><span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>{stop?.arrivalDate && stop?.departureDate && (<span className="hero-yatra-badge-dates">{new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>)}<span className="hero-yatra-badge-arrow">→</span></Link>) })}</div>)}
      </section>
      <hr className="section-divider" />
      <div className="shankaracharya-section"><div className="location-section">
        <h2 className="location-section-heading">Connection to Adi Shankaracharya</h2>
        <div className="shankaracharya-content">
          <p>Srinagar holds profound significance in the legacy of Adi Shankaracharya. The <strong>Shankaracharya Temple</strong> (Jyeshtheshwara Temple) atop the Gopadri hill is traditionally associated with his visit to Kashmir around the 8th century CE. According to the <em>Shankaravijaya</em> accounts, he ascended to the <strong>Sarvajnapitha</strong> (Throne of Omniscience) in Kashmir — the highest seat of philosophical debate — and established the supremacy of Advaita Vedanta. Kashmir was historically one of the most important centres of Sanskrit learning and Shaiva philosophy.</p>
          <span className="citation"><strong>Source:</strong> <em>Shankaravijaya</em> literature (multiple recensions); the Shankaracharya Temple&apos;s association is documented in local tradition and the temple&apos;s archaeological record dating to at least 200 BCE.</span>
        </div>
      </div></div>
      <hr className="section-divider" />
      <div className="location-section"><h2 className="location-section-heading">Places of Interest</h2><div className="poi-grid">{placesOfInterest.map((poi) => (<div className="poi-card" key={poi.name}><div className="poi-icon">{poi.icon}</div><h3>{poi.name}</h3><p>{poi.desc}</p></div>))}</div></div>
      <footer className="location-footer"><p>An initiative of <span className="org-name">Vedanta Bharati</span></p><p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p></footer>
    </>
  )
}
