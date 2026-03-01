import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location, Expedition } from '@/payload-types'
import '../../styles.css'
import '../location.css'

export const metadata = { title: 'Belavadi | Shankarajyothi', description: 'Belavadi — a spiritually significant kshetra' }
export default async function BelavadiPage() {
  const payload = await getPayload({ config })
  const locationResult = await payload.find({ collection: 'locations', where: { qrSlug: { equals: 'loc-belavadi' } }, limit: 1 })
  const location = locationResult.docs[0] as Location | undefined
  
  let relatedExpeditions: Expedition[] = []
  if (location) { 
    const expResult = await payload.find({ collection: 'expeditions', depth: 2, limit: 10 })
    relatedExpeditions = expResult.docs.filter((exp) => 
      exp.itinerary?.some((stop) => { 
        const loc = stop.location as Location | number; 
        return typeof loc === 'object' ? loc.id === location.id : loc === location.id 
      }) || exp.itinerary?.some((stop) => 
        stop.satelliteLocations?.some((sat) => {
          const satLoc = sat.location as Location | number;
          return typeof satLoc === 'object' ? satLoc.id === location.id : satLoc === location.id
        })
      )
    ) 
  }

  return (
    <>
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link><Link href="/location" className="back-link" style={{ marginLeft: '1.5rem' }}>All Locations</Link>
        <h1>{location?.name ?? 'Belavadi'}</h1>
        <p className="location-desc">A historic and spiritually significant kshetra graced by the divine presence of Adi Shankaracharya.</p>
        
        {relatedExpeditions.length > 0 && (
          <div className="hero-yatra-badges">
            {relatedExpeditions.map((exp) => { 
              let matchDate: string | undefined | null;
              exp.itinerary?.forEach(stop => {
                const mainLoc = stop.location as Location | number;
                if (typeof mainLoc === 'object' ? mainLoc.id === location?.id : mainLoc === location?.id) {
                  matchDate = stop.arrivalDate;
                }
                stop.satelliteLocations?.forEach(sat => {
                  const satLoc = sat.location as Location | number;
                  if (typeof satLoc === 'object' ? satLoc.id === location?.id : satLoc === location?.id) {
                    matchDate = sat.date || stop.arrivalDate;
                  }
                });
              });

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

      <div className="location-section">
        <h2 className="location-section-heading">About This Stop</h2>
        <p style={{ fontWeight: 500, lineHeight: 1.8, marginBottom: '1rem' }}>
          It is traditionally believed that Adi Shankaracharya arrived at Belavadi on the auspicious day of Vaishakha Shuddha Panchami. On the following day, Vaishakha Shuddha Shasti, Adi Shankaracharya is said to have performed sacred worship at this kshetra, sanctifying the Udbhava Ganapati Temple through pooja and divine presence.
        </p>
        <p style={{ fontWeight: 500, lineHeight: 1.8, marginBottom: '1rem' }}>
          In remembrance of this sacred association, the temple authorities continue, even today, to perform special worship on Vaishakha Shuddha Dwadashi, preserving the memory of Adi Shankara’s visit through a living ritual tradition — a continuity that bridges centuries.
        </p>
        <p style={{ fontWeight: 500, lineHeight: 1.8, marginBottom: '1rem' }}>
          Tradition further holds that Adi Shankaracharya anchored himself at this temple during the stay, using it as a spiritual centre while visiting other sacred shrines in the region. Adi Shankara is believed to have visited the majestic Veera Narayana Temple, the grand Hoysala architectural masterpiece of the region, whose intricate stone craftsmanship and trikuta design stand as a luminous expression of Karnataka’s devotional and artistic zenith.
        </p>
        <p style={{ fontWeight: 500, lineHeight: 1.8, marginBottom: '1rem' }}>
          Adi Shankara is also supposed to have visited the ancient Udbhava Kalleshwara Temple, a revered Shaiva shrine.
        </p>
        <p style={{ fontWeight: 500, lineHeight: 1.8 }}>
          Through such visits, Adi Shankaracharya’s presence is understood not merely as an act of pilgrimage, but as a conscious effort to strengthen sacred institutions, harmonise devotional traditions, and anchor dharmic life within temple-centred communities.
        </p>
      </div>

      <footer className="location-footer">
        <p>An initiative of <span className="org-name">Vedanta Bharati</span></p>
        <p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p>
      </footer>
    </>
  )
}
