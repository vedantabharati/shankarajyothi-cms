import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Expedition, Location, Photo } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import MediaTabs from './PhotoCarousel'
import '../../../../styles.css'
import '../../../../location/location.css'
import './stop.css'

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
  'loc-belavadi': '/location/belavadi',
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

  const calloutHref = SLUG_TO_PATH[currentStop.qrSlug] || (currentStop.isSatellite && currentStop.primaryQrSlug ? SLUG_TO_PATH[currentStop.primaryQrSlug] : '/location')
  const hasOwnStaticPage = !!SLUG_TO_PATH[currentStop.qrSlug]

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const videoLinks = currentStop.videoUrls ? currentStop.videoUrls.split(',').map(url => url.trim()) : []

  // Fetch aspect ratio data for videos to distinguish between portrait and landscape
  const videoData = await Promise.all(videoLinks.map(async (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i)
    const videoId = match ? match[1] : null
    let orientation: 'landscape' | 'portrait' = 'landscape' // default

    if (videoId) {
      if (url.toLowerCase().includes('/shorts/')) {
        orientation = 'portrait'
      } else {
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, { next: { revalidate: 86400 } })
          if (res.ok) {
            const data = await res.json()
            if (data.width && data.height && data.height > data.width) {
              orientation = 'portrait'
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }
    return { url, videoId, orientation }
  }))

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

  return (
    <>
      <section className="stop-hero">
        <Link href={`/expedition`} className="back-link">← Back to Expedition Map</Link>
        <h1 className="stop-title">{currentStop.name}</h1>
        {currentStop.subtitle && (
          <p className="stop-subtitle">{currentStop.subtitle}</p>
        )}

        {/* Navigation & Dates */}
        <div className="stop-nav">
          {prevStop ? (
            <Link href={`/expedition/${expeditionId}/stop/${prevStop.qrSlug}`} className="nav-btn prev-btn">
              <span className="nav-arrow">←</span>
              <span className="nav-label">{prevStop.name}</span>
            </Link>
          ) : <div className="nav-btn placeholder"></div>}

          <div className="stop-dates">
            {currentStop.isSatellite ? (
              <span>Visited: <strong>{formatDate(currentStop.arrivalDate)}</strong></span>
            ) : (
              <span>
                <strong>{formatDate(currentStop.arrivalDate)}</strong>
                {currentStop.departureDate && ` – ${formatDate(currentStop.departureDate)}`}
              </span>
            )}
          </div>

          {nextStop ? (
            <Link href={`/expedition/${expeditionId}/stop/${nextStop.qrSlug}`} className="nav-btn next-btn">
              <span className="nav-label">{nextStop.name}</span>
              <span className="nav-arrow">→</span>
            </Link>
          ) : <div className="nav-btn placeholder" style={{ visibility: 'hidden' }}></div>}
        </div>
      </section>

      <div className="location-section">
        {/* Media */}
        {hasMedia && (
          <div className="stop-media-section">
            <h2 className="location-section-heading">Media</h2>
            <p style={{ marginTop: '-1.5rem', marginBottom: '1.5rem', color: 'var(--brown-text)', fontStyle: 'italic', fontSize: '0.95rem' }}>
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
