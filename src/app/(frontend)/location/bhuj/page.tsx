import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Bhuj | Shankarajyothi', description: 'Bhuj — Dholavira, Narayana Sarovara, Madeva Temple.' }

export default async function BhujPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-bhuj' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) {
    const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
    relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id }))
  }
  const placesOfInterest = [
    { icon: '🏛️', name: 'Dholavira', desc: 'A UNESCO World Heritage Site — one of the largest and most prominent Harappan civilisation sites, dating to 3000–1500 BCE.' },
    { icon: '🌊', name: 'Narayana Sarovara', desc: 'A sacred lake mentioned in the Puranas, one of the five holy lakes (Panch Sarovar) of Hindu tradition.' },
    { icon: '🛕', name: 'Madeva Temple', desc: 'An ancient Shiva temple in the Kutch region with local historical significance.' },
  ]
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Bhuj'}</h1>
        <p className="location-desc">Gateway to the Kutch region — home to the ancient Dholavira civilisation site, the sacred Narayana Sarovara, and the Rann of Kutch.</p>
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
