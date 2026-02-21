import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Kurukshetra | Shankarajyothi', description: 'Kurukshetra — Land of the Mahabharata, Brahma Sarovar, Jyotisar.' }
export default async function KurukshetraPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-kurukshetra' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) { const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 }); relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id })) }
  const placesOfInterest = [
    { icon: '🌊', name: 'Brahma Sarovar', desc: 'One of the most sacred tanks in India, believed to have been created by Lord Brahma. Bathing here during a solar eclipse is considered especially auspicious.' },
    { icon: '🌳', name: 'Jyotisar', desc: 'The sacred site where Lord Krishna is believed to have delivered the Bhagavad Gita to Arjuna before the Mahabharata war. Marked by an ancient banyan tree.' },
  ]
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link><Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Kurukshetra'}</h1>
        <p className="location-desc">The land of the Mahabharata — where Lord Krishna delivered the Bhagavad Gita. Home to the sacred Brahma Sarovar and Jyotisar.</p>
        {relatedExpeditions.length > 0 && (<div className="hero-yatra-badges">{relatedExpeditions.map((exp) => { const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id }); return (<Link href="/expedition" key={exp.id} className="hero-yatra-badge"><span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>{stop?.arrivalDate && stop?.departureDate && (<span className="hero-yatra-badge-dates">{new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>)}<span className="hero-yatra-badge-arrow">→</span></Link>) })}</div>)}
      </section>
      <hr className="section-divider" />
      <div className="location-section"><h2 className="location-section-heading">Places of Interest</h2><div className="poi-grid">{placesOfInterest.map((poi) => (<div className="poi-card" key={poi.name}><div className="poi-icon">{poi.icon}</div><h3>{poi.name}</h3><p>{poi.desc}</p></div>))}</div></div>
      <footer className="location-footer"><p>An initiative of <span className="org-name">Vedanta Bharati</span></p><p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p></footer>
    </>
  )
}
