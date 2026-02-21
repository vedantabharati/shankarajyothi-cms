import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Dwarka | Shankarajyothi', description: 'Dwarka — one of the four Amnaya Peethas established by Adi Shankaracharya.' }

export default async function DwarkaPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-dwarka' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) {
    const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
    relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id }))
  }
  const placesOfInterest = [
    { icon: '🛕', name: 'Dwarkadhish Temple', desc: 'The main temple of Lord Krishna in Dwarka, believed to have been originally established over 2,500 years ago. One of the Char Dham pilgrimage sites.' },
    { icon: '🕉️', name: 'Dwarka Sharada Peetham', desc: 'The western Amnaya Peetham — one of the four cardinal monastic institutions established by Adi Shankaracharya to preserve Vedantic teaching.' },
  ]
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Dwarka'}</h1>
        <p className="location-desc">The sacred city of Lord Krishna and seat of the western Amnaya Peetham — one of the four cardinal mathas established by Adi Shankaracharya.</p>
        {relatedExpeditions.length > 0 && (<div className="hero-yatra-badges">{relatedExpeditions.map((exp) => { const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id }); return (<Link href="/expedition" key={exp.id} className="hero-yatra-badge"><span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>{stop?.arrivalDate && stop?.departureDate && (<span className="hero-yatra-badge-dates">{new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>)}<span className="hero-yatra-badge-arrow">→</span></Link>) })}</div>)}
      </section>
      <hr className="section-divider" />
      <div className="shankaracharya-section"><div className="location-section">
        <h2 className="location-section-heading">Connection to Adi Shankaracharya</h2>
        <div className="shankaracharya-content">
          <p>Dwarka is the seat of the <strong>Dwarka Sharada Peetham</strong> (also known as Kalika Peetham), the western Amnaya Peetham established by Adi Shankaracharya. It is one of the four cardinal monastic institutions he founded at the four corners of Bharata to preserve and propagate Advaita Vedanta. The Peetham&apos;s first pontiff was <strong>Hastamalakacharya</strong>, one of Shankaracharya&apos;s four principal disciples.</p>
          <span className="citation"><strong>Source:</strong> Institutional history of Dwarka Sharada Peetham; documented in the <em>Shankaravijaya</em> literature and the tradition of the four Amnaya Peethas.</span>
        </div>
      </div></div>
      <hr className="section-divider" />
      <div className="location-section">
        <h2 className="location-section-heading">Places of Interest</h2>
        <div className="poi-grid">{placesOfInterest.map((poi) => (<div className="poi-card" key={poi.name}><div className="poi-icon">{poi.icon}</div><h3>{poi.name}</h3><p>{poi.desc}</p></div>))}</div>
      </div>
      <footer className="location-footer"><p>An initiative of <span className="org-name">Vedanta Bharati</span></p><p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p></footer>
    </>
  )
}
