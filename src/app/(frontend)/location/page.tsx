import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Location } from '@/payload-types'
import '../styles.css'
import './location.css'

export const metadata = {
  title: 'Locations | Shankarajyothi',
  description:
    'All locations on the Shaankara Jyothi Prakasha yatra — an alphabetical directory of sacred sites across Bharata.',
}

/* Map qrSlug → URL path for locations that have detail pages */
const SLUG_TO_PATH: Record<string, string> = {
  'loc-kr-nagar': '/location/kr-nagar',
  'loc-chk-01': '/location/chikkamagaluru',
  'loc-shimoga': '/location/shimoga',
  'loc-kumta': '/location/kumta',
  'loc-ponda-goa': '/location/ponda',
  'loc-ratnagiri': '/location/ratnagiri',
  'loc-kolhapur': '/location/kolhapur',
  'loc-sajjangad': '/location/sajjangad',
  'loc-pandharpur': '/location/pandharpur',
  'loc-solapur': '/location/solapur',
  'loc-nanded': '/location/nanded',
  'loc-ramtek': '/location/ramtek',
  'loc-karanja': '/location/karanja',
  'loc-sambaji-01': '/location/sambhajinagar',
  'loc-beed': '/location/beed',
  'loc-nashik': '/location/nashik',
  'loc-surat': '/location/surat',
  'loc-vadodara': '/location/vadodara',
  'loc-bhavnagar': '/location/bhavnagar',
  'loc-somnath': '/location/somnath',
  'loc-junagadh': '/location/junagadh',
  'loc-dwarka': '/location/dwarka',
  'loc-jamnagar': '/location/jamnagar',
  'loc-bhuj': '/location/bhuj',
  'loc-ahmedabad': '/location/ahmedabad',
  'loc-mount-abu': '/location/mount-abu',
  'loc-udaipur': '/location/udaipur',
  'loc-jalore': '/location/jalore',
  'loc-barmer': '/location/barmer',
  'loc-jaisalmer': '/location/jaisalmer',
  'loc-bikaner': '/location/bikaner',
  'loc-jodhpur': '/location/jodhpur',
  'loc-ajmer': '/location/ajmer',
  'loc-jaipur': '/location/jaipur',
  'loc-kota': '/location/kota',
  'loc-rohtak': '/location/rohtak',
  'loc-kurukshetra': '/location/kurukshetra',
  'loc-chandigarh': '/location/chandigarh',
  'loc-ludhiana': '/location/ludhiana',
  'loc-amritsar': '/location/amritsar',
  'loc-srinagar': '/location/srinagar',
  'loc-anantnag': '/location/anantnag',
  'loc-horanadu': '/location/horanadu',
}

export default async function LocationsIndexPage() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'locations',
    limit: 200,
    sort: 'name',
  })

  const locations = result.docs as Location[]

  /* Group by first letter */
  const grouped: Record<string, Location[]> = {}
  for (const loc of locations) {
    const letter = loc.name.charAt(0).toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(loc)
  }
  const sortedLetters = Object.keys(grouped).sort()

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="location-hero">
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Locations</h1>
        <p className="location-desc">
          All sacred sites and stops on the Shaankara Jyothi Prakasha yatra route, listed alphabetically.
        </p>

        {/* Letter jump-nav */}
        <div className="letter-nav">
          {sortedLetters.map((letter) => (
            <a href={`#letter-${letter}`} key={letter} className="letter-nav-item">
              {letter}
            </a>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* ===== LISTING ===== */}
      <div className="location-section">
        {sortedLetters.map((letter) => (
          <div key={letter} id={`letter-${letter}`} className="letter-group">
            <h2 className="letter-heading">{letter}</h2>
            <div className="location-list">
              {grouped[letter].map((loc) => {
                const href = loc.qrSlug ? SLUG_TO_PATH[loc.qrSlug] : undefined
                const Inner = (
                  <>
                    <span className="loc-list-name">{loc.name}</span>
                    {href && <span className="loc-list-arrow">→</span>}
                  </>
                )

                return href ? (
                  <Link href={href} key={loc.id} className="loc-list-item loc-list-link">
                    {Inner}
                  </Link>
                ) : (
                  <div key={loc.id} className="loc-list-item">
                    {Inner}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="location-footer">
        <p>An initiative of <span className="org-name">Vedanta Bharati</span></p>
        <p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p>
      </footer>
    </>
  )
}
