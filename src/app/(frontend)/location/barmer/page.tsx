import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Barmer | Shankarajyothi', description: 'Barmer — Western Rajasthan.' }
export default async function BarmerPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-barmer' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) { const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 }); relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id })) }
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link><Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Barmer'}</h1>
        <p className="location-desc">A town at the edge of the Thar desert in western Rajasthan — known for its vibrant folk art, textiles, and the Kiradu Temple ruins.</p>
        {relatedExpeditions.length > 0 && (<div className="hero-yatra-badges">{relatedExpeditions.map((exp) => { const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id }); return (<Link href="/expedition" key={exp.id} className="hero-yatra-badge"><span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>{stop?.arrivalDate && stop?.departureDate && (<span className="hero-yatra-badge-dates">{new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>)}<span className="hero-yatra-badge-arrow">→</span></Link>) })}</div>)}
      </section>
      <hr className="section-divider" />
      <div className="location-section"><h2 className="location-section-heading">About This Stop</h2><p style={{ fontWeight: 500, lineHeight: 1.8 }}>Barmer is a district in western Rajasthan at the edge of the Thar desert. Known for its Kiradu Temple ruins — often called the &quot;Khajuraho of Rajasthan&quot; — and its vibrant traditions of wood carving, embroidery, and block printing.</p></div>
      <footer className="location-footer"><p>An initiative of <span className="org-name">Vedanta Bharati</span></p><p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p></footer>
    </>
  )
}
