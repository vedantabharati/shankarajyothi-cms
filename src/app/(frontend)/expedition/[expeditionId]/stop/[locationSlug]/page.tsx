import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import type { Expedition, Location } from '@/payload-types'
import '../../../../styles.css'
import '../../../../location/location.css'
import './stop.css'

export default async function ExpeditionStopPage(props: { params: Promise<{ expeditionId: string, locationSlug: string }> }) {
  const { expeditionId, locationSlug } = await props.params
  const payload = await getPayload({ config })
  
  const expeditionResult = await payload.find({
    collection: 'expeditions',
    where: { id: { equals: expeditionId } },
    depth: 2,
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
    primaryQrSlug?: string
    primaryName?: string
    satelliteLocations?: any[] // for primary stops to show cards
  }

  const flattened: FlattenedStop[] = []
  
  ;(expedition.itinerary || []).forEach((item) => {
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
        satelliteLocations: item.satelliteLocations || undefined,
        primaryQrSlug: mainQrSlug,
        primaryName: mainLoc.name
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
          primaryQrSlug: mainQrSlug,
          primaryName: mainLoc?.name
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

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const videoLinks = currentStop.videoUrls ? currentStop.videoUrls.split(',').map(url => url.trim()) : []

  return (
    <>
      <section className="stop-hero">
        <Link href={`/expedition`} className="back-link">← Back to Expedition Map</Link>
        <h1 className="stop-title">{currentStop.name}</h1>
        
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

        {/* Navigation Buttons */}
        <div className="stop-nav">
          {prevStop ? (
            <Link href={`/expedition/${expeditionId}/stop/${prevStop.qrSlug}`} className="nav-btn prev-btn">
              <span className="nav-arrow">←</span> 
              <span className="nav-label">Previous: {prevStop.name}</span>
            </Link>
          ) : <div className="nav-btn placeholder"></div>}
          
          {nextStop ? (
            <Link href={`/expedition/${expeditionId}/stop/${nextStop.qrSlug}`} className="nav-btn next-btn">
              <span className="nav-label">Next: {nextStop.name}</span>
              <span className="nav-arrow">→</span>
            </Link>
          ) : <div className="nav-btn placeholder"></div>}
        </div>
      </section>

      <div className="location-section">
        {/* Callout Link */}
        <div className="historical-callout">
          <p>
            {currentStop.isSatellite 
              ? `Find out more about Adi Shankaracharya's historic visit to the main location: ` 
              : `Find out more about Adi Shankaracharya's visit to this location: `}
            <Link href={`/location/${currentStop.isSatellite ? currentStop.primaryQrSlug : currentStop.qrSlug}`} className="callout-link">
              <strong>{currentStop.isSatellite ? currentStop.primaryName : currentStop.name}</strong> 
              <span className="callout-arrow">↗</span>
            </Link>
          </p>
        </div>

        {/* Media */}
        {videoLinks.length > 0 && (
          <div className="stop-media-section">
            <h2 className="location-section-heading">Media</h2>
            <div className="video-grid">
              {videoLinks.map((url, i) => {
                // Extract youtube ID for embed
                let videoId = null
                try {
                  const urlObj = new URL(url)
                  if (urlObj.hostname === 'youtu.be') {
                    videoId = urlObj.pathname.slice(1)
                  } else if (urlObj.hostname.includes('youtube.com')) {
                    if (urlObj.pathname.startsWith('/embed/')) {
                      videoId = urlObj.pathname.split('/')[2]
                    } else if (urlObj.pathname === '/watch') {
                      videoId = urlObj.searchParams.get('v')
                    } else if (urlObj.pathname.startsWith('/v/')) {
                      videoId = urlObj.pathname.split('/')[2]
                    }
                  }
                } catch (e) {
                  // Fallback to regex if URL parsing fails
                  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
                  videoId = match ? match[1] : null
                }
                if (videoId) {
                  return (
                    <div className="video-wrapper" key={i}>
                      <iframe 
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title={`Video ${i+1}`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  )
                }
                return (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
                    ▶ Watch Video {i+1}
                  </a>
                )
              })}
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
      </div>

      <footer className="location-footer">
        <p>An initiative of <span className="org-name">Vedanta Bharati</span></p>
        <p className="tagline">Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya</p>
      </footer>
    </>
  )
}
