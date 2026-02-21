import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Ahmedabad | Shankarajyothi', description: 'Ahmedabad — Shankarajayanti celebrations, Advaitashrama, and more.' }

export default async function AhmedabadPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-ahmedabad' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) {
    const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
    relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id }))
  }
  const placesOfInterest = [
    { icon: '🕉️', name: 'Advaitashrama', desc: 'An Advaita Vedanta centre in Ahmedabad promoting the study and practice of Shankaracharya\'s teachings.' },
    { icon: '🔱', name: 'Neelakant Mahadev Temple', desc: 'A Shiva temple in the Ahmedabad region, visited as part of the yatra\'s Gujarat itinerary.' },
    { icon: '🏛️', name: 'Dadichi Mahashri Ashram', desc: 'A spiritual centre dedicated to Vedantic teaching and cultural preservation.' },
    { icon: '🌊', name: 'Sabarmati', desc: 'The historic Sabarmati riverfront — culturally significant in Ahmedabad\'s spiritual and civic heritage.' },
  ]
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Ahmedabad'}</h1>
        <p className="location-desc">Gujarat&apos;s largest city — hosting Shankarajayanti celebrations with visits to the Advaitashrama, Neelakant Mahadev, and the Sabarmati.</p>
        {relatedExpeditions.length > 0 && (<div className="hero-yatra-badges">{relatedExpeditions.map((exp) => { const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id }); return (<Link href="/expedition" key={exp.id} className="hero-yatra-badge"><span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>{stop?.arrivalDate && stop?.departureDate && (<span className="hero-yatra-badge-dates">{new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>)}<span className="hero-yatra-badge-arrow">→</span></Link>) })}</div>)}
      </section>
      <hr className="section-divider" />
      <div className="location-section">
        <h2 className="location-section-heading">Places of Interest</h2>
        <div className="poi-grid">{placesOfInterest.map((poi) => (<div className="poi-card" key={poi.name}><div className="poi-icon">{poi.icon}</div><h3>{poi.name}</h3><p>{poi.desc}</p></div>))}</div>
      </div>
      <footer className="location-footer"><p>An initiative of <span className="org-name">Vedanta Bharati</span></p><p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p></footer>
    </>
  )
}
