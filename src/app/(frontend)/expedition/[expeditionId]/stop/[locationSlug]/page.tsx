import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Expedition, Location, Photo } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import MediaTabs from './PhotoCarousel'
import { formatDate, formatShortDate } from '@/utils/date'
import { extractVideoId } from '@/utils/youtube'
import '../../../../styles.css'
import '../../../../location/location.css'
import './stop.css'


export async function generateMetadata(props: { params: Promise<{ expeditionId: string, locationSlug: string }> }) {
  const { expeditionId, locationSlug } = await props.params
  const payload = await getPayload({ config })

  const [locationResult, expeditionResult] = await Promise.all([
    payload.find({
      collection: 'locations',
      where: { qrSlug: { equals: locationSlug } },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'expeditions',
      where: { id: { equals: expeditionId } },
      limit: 1,
      depth: 0,
    }),
  ])

  const location = locationResult.docs[0]
  const expedition = expeditionResult.docs[0]
  if (!location) return {}

  const expeditionTitle = expedition?.title ?? 'Shaankara Jyothi Prakasha'
  const title = `${location.name} | ${expeditionTitle}`
  const description = location.subtitle
    ?? `${location.name} — a stop on the ${expeditionTitle} yatra.`

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function ExpeditionStopPage(props: { params: Promise<{ expeditionId: string, locationSlug: string }> }) {
  const { expeditionId, locationSlug } = await props.params
  const payload = await getPayload({ config })

  const expeditionResult = await payload.find({
    collection: 'expeditions',
    where: { id: { equals: expeditionId } },
    depth: 10,
    limit: 1
  })
  const expedition = expeditionResult.docs[0] as Expedition | undefined
  if (!expedition) return <div className="section"><p>Expedition not found.</p></div>

  // Flatten itinerary to determine Prev/Next and current stop details
  type FlattenedStop = {
    isSatellite: boolean
    name: string
    qrSlug: string
    arrivalDate: string
    departureDate: string | null | undefined
    videoUrls: string | null | undefined
    videoOrientations: string | null | undefined
    photos?: (number | Photo)[] | null
    primaryQrSlug?: string
    primaryName?: string
    subtitle?: string | null
    historicalContext?: any
    satelliteLocations?: any[] // for primary stops to show cards
  }

  const flattened: FlattenedStop[] = []

    ; (expedition.itinerary || []).forEach((item) => {
      const mainLoc = typeof item.location === 'object' && item.location !== null ? (item.location as Location) : null
      const mainQrSlug = mainLoc?.qrSlug || ''

      // push primary
      if (mainLoc) {
        flattened.push({
          isSatellite: false,
          name: mainLoc.name,
          qrSlug: mainQrSlug,
          arrivalDate: item.arrivalDate,
          departureDate: item.departureDate,
          videoUrls: item.videoUrls,
          videoOrientations: item.videoOrientations,
          photos: item.photos,
          satelliteLocations: item.satelliteLocations || undefined,
          primaryQrSlug: mainQrSlug,
          primaryName: mainLoc.name,
          subtitle: mainLoc.subtitle || null,
          historicalContext: mainLoc.historicalContext || undefined,
        })
      }

      // push satellites
      const satellites = (item.satelliteLocations || [])
        .filter((sat) => typeof sat.location === 'object' && sat.location !== null)
        .map((sat) => {
          const satLoc = sat.location as Location
          return {
            isSatellite: true,
            name: satLoc.name,
            qrSlug: satLoc.qrSlug || '',
            arrivalDate: sat.date || item.arrivalDate,
            departureDate: null,
            videoUrls: sat.videoUrls,
            videoOrientations: sat.videoOrientations,
            photos: sat.photos,
            primaryQrSlug: mainQrSlug,
            primaryName: mainLoc?.name,
            subtitle: satLoc.subtitle || null,
            historicalContext: satLoc.historicalContext || undefined,
          }
        })
        .sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime())

      flattened.push(...satellites)
    })

  // Find current index
  const currentIndex = flattened.findIndex(s => s.qrSlug === locationSlug)
  if (currentIndex === -1) return <div className="location-section"><p>Stop not found in this expedition.</p></div>

  const currentStop = flattened[currentIndex]
  const prevStop = currentIndex > 0 ? flattened[currentIndex - 1] : null
  const nextStop = currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null

  const videoLinks = currentStop.videoUrls ? currentStop.videoUrls.split(',').map(url => url.trim()) : []
  const storedOrientations = currentStop.videoOrientations ? currentStop.videoOrientations.split(',').map(o => o.trim()) : []

  const videoData = videoLinks.map((url, i) => {
    const videoId = extractVideoId(url)
    const orientation: 'landscape' | 'portrait' = storedOrientations[i] === 'portrait' ? 'portrait' : 'landscape'
    return { url, videoId, orientation }
  })

  // Extract resolved photo objects
  const photoItems = (currentStop.photos || [])
    .filter((p): p is Photo => typeof p === 'object' && p !== null && !!p.url)
    .map((p) => ({
      url: p.url!, // Use original uncropped image
      alt: p.alt || '',
      caption: p.caption || null,
    }))

  // Build video items for embeddable videos
  const videoItems = videoData
    .filter((v) => v.videoId)
    .map((v) => ({
      videoId: v.videoId!,
      orientation: v.orientation,
    }))

  // Non-embeddable video links (fallback)
  const fallbackLinks = videoData.filter((v) => !v.videoId)

  const hasMedia = photoItems.length > 0 || videoItems.length > 0 || fallbackLinks.length > 0

  // Determine the short date string
  let shortDateString = formatShortDate(currentStop.arrivalDate)
  if (!currentStop.isSatellite && currentStop.departureDate) {
    const arrMonth = new Date(currentStop.arrivalDate).getMonth()
    const depMonth = new Date(currentStop.departureDate).getMonth()
    if (arrMonth === depMonth) {
      shortDateString += ` – ${new Date(currentStop.departureDate).getDate()}`
    } else {
      shortDateString += ` – ${formatShortDate(currentStop.departureDate)}`
    }
  }

  return (
    <>
      <section className="stop-hero">
        <div className="stop-top-nav" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <Link href="/" className="back-link">
            <span aria-hidden="true">← </span>
            <span className="hide-mobile">Back to </span>Home
          </Link>

          <div className="compact-date-badge" title={currentStop.isSatellite ? 'Visited Date' : 'Visit Dates'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {shortDateString}
          </div>

          <Link href={`/expedition`} className="back-link">
            <span className="hide-mobile">Back to </span>Map
            <span aria-hidden="true" className="hide-mobile"> →</span>
          </Link>
        </div>
        
        <h1 className="stop-title">{currentStop.name}</h1>
        {currentStop.subtitle && (
          <p className="stop-subtitle">{currentStop.subtitle}</p>
        )}

        {/* Navigation */}
        <div className="stop-nav">
          {prevStop ? (
            <Link href={`/expedition/${expeditionId}/stop/${prevStop.qrSlug}`} className="nav-btn prev-btn">
              <span className="nav-arrow">←</span>
              <span className="nav-label">{prevStop.name}</span>
            </Link>
          ) : <div className="nav-btn placeholder"></div>}

          {nextStop ? (
            <Link href={`/expedition/${expeditionId}/stop/${nextStop.qrSlug}`} className="nav-btn next-btn">
              <span className="nav-label">{nextStop.name}</span>
              <span className="nav-arrow">→</span>
            </Link>
          ) : <div className="nav-btn placeholder"></div>}
        </div>
      </section>

      <div className="location-section">
        {/* Media */}
        {hasMedia && (
          <div className="stop-media-section">
            <h2 className="location-section-heading hide-mobile">Media</h2>
            <p className="hide-mobile" style={{ marginTop: '-1.5rem', marginBottom: '1.5rem', color: 'var(--brown-text)', fontStyle: 'italic', fontSize: '0.95rem' }}>
              From the Sampoorna Bharata Yatra of Sri Sri Shankara Bharati Mahaswamiji
            </p>
            <MediaTabs photos={photoItems} videos={videoItems} />

            {fallbackLinks.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                {fallbackLinks.map((v, i) => (
                  <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
                    ▶ Watch Video {i + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historical Context - separated out from the standard content block for emphasis */}
        {currentStop.historicalContext && (
          <div className="historical-context-wrapper" style={{ margin: '4rem 0 2rem' }}>
            <div className="section-divider" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '3rem',
              opacity: 0.6
            }}>
              <span style={{ height: '1px', background: 'var(--saffron)', flex: 1, maxWidth: '200px' }}></span>
              <span style={{ padding: '0 1rem', color: 'var(--saffron)', fontSize: '1.5rem' }}>❖</span>
              <span style={{ height: '1px', background: 'var(--saffron)', flex: 1, maxWidth: '200px' }}></span>
            </div>

            <div className="shankaracharya-section">
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--brown-text)',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                opacity: 0.9,
                textAlign: 'center'
              }}>
                Information uncovered during the Shaankara Jyoti Prakasha initiative to document Adi Shankara&apos;s continuing civilizational legacy.
              </p>

              <h2 className="location-section-heading" style={{ textAlign: 'center', margin: '0 0 2rem 0', padding: 0 }}>
                Adi Shankaracharya&apos;s Visit
              </h2>
              <div className="shankaracharya-content">
                <RichText data={currentStop.historicalContext} />
                <p className="historical-disclaimer" style={{ 
                  marginTop: '1.5rem', 
                  fontSize: '0.85rem', 
                  fontStyle: 'italic', 
                  opacity: 0.8,
                  lineHeight: 1.5,
                  textAlign: 'left' // Ensure readable contrast to the centered headers
                }}>
                  The above findings are based on local recitations and living traditions, as well as inscriptions and markers observed at the site, supported by available historical references, certain scientific observations, and guidance from the Shastras. As our understanding continues to evolve, we will update this account from time to time as additional insights and information emerge from local communities and further study.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Satellite Cards for Primary Stops */}
        {!currentStop.isSatellite && currentStop.satelliteLocations && currentStop.satelliteLocations.length > 0 && (
          <div className="satellite-cards-section">
            <h2 className="location-section-heading">Places of Interest Visited</h2>
            <div className="satellite-grid">
              {currentStop.satelliteLocations
                .filter(sat => typeof sat.location === 'object' && sat.location !== null)
                .sort((a, b) => new Date(a.date || currentStop.arrivalDate).getTime() - new Date(b.date || currentStop.arrivalDate).getTime())
                .map((sat, i) => {
                  const satLoc = sat.location as Location
                  return (
                    <Link key={i} href={`/expedition/${expeditionId}/stop/${satLoc.qrSlug}`} className="sat-card">
                      <h3 className="sat-card-title">{satLoc.name}</h3>
                      <div className="sat-card-date">Visited: {formatDate(sat.date || currentStop.arrivalDate)}</div>
                      <span className="sat-card-arrow">View Details →</span>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        )}

        {/* Empty State Fallback */}
        {videoLinks.length === 0 && photoItems.length === 0 && !currentStop.historicalContext && (!currentStop.satelliteLocations || currentStop.satelliteLocations.length === 0) && (
          <div className="location-section" style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.6 }}>
            <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>
              Content for this location is coming soon.
            </p>
          </div>
        )}
      </div>

      <footer className="location-footer">
        <p>An initiative of <span className="org-name">Vedanta Bharati</span></p>
        <p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p>
      </footer>
    </>
  )
}
