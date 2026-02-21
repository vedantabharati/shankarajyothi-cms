import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Somnath | Shankarajyothi', description: 'Somnath — Somnath Jyotirlinga darshan.' }

export default async function SomnathPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-somnath' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  let relatedExpeditions: Expedition[] = []
  if (location) {
    const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
    relatedExpeditions = expResult.docs.filter((exp) => exp.itinerary?.some((stop) => { const loc = stop.location as Location | number; return typeof loc === 'object' ? loc.id === location.id : loc === location.id }))
  }
  const placesOfInterest = [
    { icon: '🔱', name: 'Somnath Jyotirlinga', desc: 'The first of the twelve Jyotirlingas, located on the western coast of Gujarat at the confluence of three rivers. Rebuilt multiple times, the current temple was reconstructed in 1951.' },
  ]
  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Somnath'}</h1>
        <p className="location-desc">The eternal shrine — home to the first of the twelve Jyotirlingas on the western coast of Gujarat.</p>
        {relatedExpeditions.length > 0 && (<div className="hero-yatra-badges">{relatedExpeditions.map((exp) => { const stop = exp.itinerary?.find((s) => { const loc = s.location as Location | number; return typeof loc === 'object' ? loc.id === location?.id : loc === location?.id }); return (<Link href="/expedition" key={exp.id} className="hero-yatra-badge"><span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>{stop?.arrivalDate && stop?.departureDate && (<span className="hero-yatra-badge-dates">{new Date(stop.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' – '}{new Date(stop.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>)}<span className="hero-yatra-badge-arrow">→</span></Link>) })}</div>)}
      </section>
      <hr className="section-divider" />
      <div className="shankaracharya-section"><div className="location-section">
        <h2 className="location-section-heading">Connection to Adi Shankaracharya</h2>
        <div className="shankaracharya-content">
          <p>Somnath is the first Jyotirlinga named in the <strong>Dwadasa Jyotirlinga Stotram</strong> attributed to Adi Shankaracharya — &ldquo;Saurashtre Somanatham cha&rdquo;. The stotram&apos;s opening invocation of Somnath underscores its primacy among the twelve sacred Shiva shrines within the Shankarite tradition.</p>
          <span className="citation"><strong>Source:</strong> Dwadasa Jyotirlinga Stotram, attributed to Adi Shankaracharya; the opening verse specifically names Somnath in Saurashtra.</span>
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
