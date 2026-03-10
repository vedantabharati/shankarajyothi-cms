import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import '../../styles.css'
import '../location.css'
import { notFound } from 'next/navigation'

export default async function DynamicLocationPage(props: { params: Promise<{ qrSlug: string }> }) {
  const { qrSlug } = await props.params
  const payload = await getPayload({ config })

  const locationResult = await payload.find({
    collection: 'locations',
    where: { qrSlug: { equals: qrSlug } },
    limit: 1,
  })
  const location = locationResult.docs[0] as Location | undefined
  if (!location) return notFound()

  // Find related expeditions (main or satellite stops)
  let relatedExpeditions: Expedition[] = []
  const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
  relatedExpeditions = expResult.docs.filter((exp) =>
    exp.itinerary?.some((stop) => {
      const loc = stop.location as Location | number
      if (typeof loc === 'object' ? loc.id === location.id : loc === location.id) return true
      return stop.satelliteLocations?.some((sat) => {
        const satLoc = sat.location as Location | number
        return typeof satLoc === 'object' ? satLoc.id === location.id : satLoc === location.id
      })
    })
  )

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location.name}</h1>
        {location.subtitle && (
          <p className="location-desc">{location.subtitle}</p>
        )}

        {relatedExpeditions.length > 0 && (
          <div className="hero-yatra-badges">
            {relatedExpeditions.map((exp) => {
              let matchDate: string | undefined | null
              exp.itinerary?.forEach(stop => {
                const mainLoc = stop.location as Location | number
                if (typeof mainLoc === 'object' ? mainLoc.id === location.id : mainLoc === location.id) {
                  matchDate = stop.arrivalDate
                }
                stop.satelliteLocations?.forEach(sat => {
                  const satLoc = sat.location as Location | number
                  if (typeof satLoc === 'object' ? satLoc.id === location.id : satLoc === location.id) {
                    matchDate = sat.date || stop.arrivalDate
                  }
                })
              })

              return (
                <Link href="/expedition" key={exp.id} className="hero-yatra-badge">
                  <span>🕉️</span><span className="hero-yatra-badge-title">{exp.title}</span>
                  {matchDate && (
                    <span className="hero-yatra-badge-dates">
                      {new Date(matchDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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

      {location.historicalContext && (
        <div className="location-section shankaracharya-section">
          <h2 className="location-section-heading">Adi Shankaracharya&apos;s Visit</h2>
          <div className="shankaracharya-content">
            <RichText data={location.historicalContext} />
            <p className="historical-disclaimer" style={{ 
              marginTop: '1.5rem', 
              fontSize: '0.85rem', 
              fontStyle: 'italic', 
              opacity: 0.8,
              lineHeight: 1.5
            }}>
              The above findings are based on local recitations and living traditions, as well as inscriptions and markers observed at the site, supported by available historical references, certain scientific observations, and guidance from the Shastras. As our understanding continues to evolve, we will update this account from time to time as additional insights and information emerge from local communities and further study.
            </p>
          </div>
        </div>
      )}

      {!location.historicalContext && (
        <div className="location-section">
          <p style={{ fontWeight: 500, opacity: 0.7 }}>
            Content for this location is coming soon.
          </p>
        </div>
      )}

      <footer className="location-footer">
        <p>An initiative of <span className="org-name">Vedanta Bharati</span></p>
        <p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p>
      </footer>
    </>
  )
}
