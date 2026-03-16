'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Expedition, Location } from '@/payload-types'
import { formatDate } from '@/utils/date'

interface ExpeditionMapProps {
  expedition: Expedition
}


export default function ExpeditionMap({ expedition }: ExpeditionMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])
  const currentRowRef = useRef<HTMLTableRowElement>(null)

  // Build the itinerary location data for rendering
  let mainItemCount = 0
  const locationsData = (expedition.itinerary || [])
    .flatMap((item) => {
      const loc = typeof item.location === 'object' && item.location !== null
        ? (item.location as Location)
        : null
      
      mainItemCount++
      const mainNum = mainItemCount

      const mainItem = {
        name: loc?.name ?? `Stop ${mainNum}`,
        coordinates: loc?.coordinates,
        arrivalDate: item.arrivalDate,
        departureDate: item.departureDate,
        qrSlug: loc?.qrSlug || null,
        videoUrls: item.videoUrls || null,
        id: item.id,
        isSatellite: false,
        displayNum: String(mainNum),
      }

      const satellites = (item.satelliteLocations || []).map((sat, satIndex) => {
        const satLoc = typeof sat.location === 'object' && sat.location !== null
          ? (sat.location as Location)
          : null
        return {
          name: satLoc?.name ?? `Satellite`,
          coordinates: satLoc?.coordinates,
          arrivalDate: sat.date || item.arrivalDate,
          departureDate: null,
          qrSlug: satLoc?.qrSlug || null,
          videoUrls: sat.videoUrls || null,
          id: sat.id || `${item.id}-sat-${satIndex}`,
          isSatellite: true,
          displayNum: '',
        }
      }).sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime())

      return [mainItem, ...satellites]
    })

  // Determine the current PRIMARY location index by date (never a satellite)
  const getCurrentIndex = (): number => {
    const now = new Date()
    // First pass: find the primary stop where today is within arrival–departure
    for (let i = 0; i < locationsData.length; i++) {
      const loc = locationsData[i]
      if (loc.isSatellite) continue
      const arrival = new Date(loc.arrivalDate)
      const departure = loc.departureDate ? new Date(loc.departureDate) : null
      if (departure && now >= arrival && now <= departure) {
        return i
      }
    }
    // Fallback: find the last primary stop whose arrival is on or before today
    let lastPrimaryBeforeToday = -1
    for (let i = 0; i < locationsData.length; i++) {
      const loc = locationsData[i]
      if (loc.isSatellite) continue
      if (new Date(loc.arrivalDate) <= now) {
        lastPrimaryBeforeToday = i
      }
    }
    return lastPrimaryBeforeToday
  }
  const currentIndex = getCurrentIndex()


  const handleRowClick = (index: number) => {
    const map = mapRef.current
    if (!map) return
    const loc = locationsData[index]
    if (!loc.coordinates?.latitude || !loc.coordinates?.longitude) return
    map.flyTo([loc.coordinates.latitude, loc.coordinates.longitude], 7, { duration: 0.6 })
    const marker = markersRef.current[index]
    if (marker) setTimeout(() => marker.openPopup(), 600)
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    const map = L.map(mapContainerRef.current, {
      center: [22.0, 78.0],
      zoom: 5,
      zoomControl: true,
      minZoom: 4,
      // Disable panning/zooming by default on mobile so users can scroll past the map
      dragging: !isMobile,
      scrollWheelZoom: false,
    })

    // Enable interaction when the user taps/clicks the map
    map.once('focus', () => {
      map.scrollWheelZoom.enable()
      map.dragging.enable()
    })

    mapRef.current = map

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&gl=IN&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google</a>'
    }).addTo(map)

    if (!expedition.itinerary || expedition.itinerary.length === 0) return

    const locationsWithCoords = expedition.itinerary
      .flatMap((item) => {
        const mainLoc = typeof item.location === 'object' && item.location !== null
          ? {
              name: (item.location as Location).name,
              coordinates: (item.location as Location).coordinates,
              arrivalDate: item.arrivalDate,
              departureDate: item.departureDate,
              qrSlug: (item.location as Location).qrSlug || null,
              videoUrls: item.videoUrls || null,
              isSatellite: false,
            }
          : null

        const satellites = (item.satelliteLocations || [])
          .filter((sat) => typeof sat.location === 'object' && sat.location !== null)
          .map((sat) => ({
            name: (sat.location as Location).name,
            coordinates: (sat.location as Location).coordinates,
            arrivalDate: sat.date || item.arrivalDate,
            departureDate: null,
            qrSlug: (sat.location as Location).qrSlug || null,
            videoUrls: sat.videoUrls || null,
            isSatellite: true,
          })).sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime())

        return mainLoc ? [mainLoc, ...satellites] : satellites
      })
      .filter((loc) => loc.coordinates?.latitude && loc.coordinates?.longitude)

    if (locationsWithCoords.length === 0) return

    // Identify the current location from the itinerary table's data
    const currentLocData = currentIndex >= 0 ? locationsData[currentIndex] : null
    const currentLocName = currentLocData?.name ?? null
    const currentLocArrival = currentLocData?.arrivalDate ?? null

    const createCustomIcon = (isFirst: boolean, isLast: boolean, isSatellite: boolean, isCurrent: boolean) => {
      if (isSatellite) {
        return L.divIcon({
          html: renderToStaticMarkup(
            <div 
              className={isCurrent ? 'marker-bounce' : ''}
              style={{
                width: '14px',
                height: '14px',
                backgroundColor: '#4B5563',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 100
              }}
            ></div>
          ),
          className: 'custom-marker-satellite',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -7],
        })
      }

      // Green for current, orange for start/end, brown for others
      const color = isCurrent ? '#10b981' : isFirst ? '#F57702' : isLast ? '#F57702' : '#622300'
      const iconHtml = renderToStaticMarkup(
        <div className={isCurrent ? 'marker-bounce' : ''} style={{ width: '100%', height: '100%' }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              backgroundColor: color,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <MapPin 
              size={16} 
              color="white" 
              style={{ transform: 'rotate(45deg)' }}
            />
          </div>
        </div>
      )

      return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    }

    const markers: L.Marker[] = []
    const routeCoordinates: [number, number][] = []

    locationsWithCoords.forEach((location, index) => {
      const latitude = location.coordinates!.latitude!
      const longitude = location.coordinates!.longitude!
      // Find the globally last main location to mark as destination
      const lastMainIndex = locationsWithCoords.map(l => l.isSatellite).lastIndexOf(false)
      const isFirst = index === 0 && !location.isSatellite
      const isLast = index === lastMainIndex && !location.isSatellite
      const isCurrent = !location.isSatellite && location.name === currentLocName && location.arrivalDate === currentLocArrival
      
      if (isCurrent) {
        console.log('CURRENT LOCATION IS:', location.name, 'LAT:', latitude, 'LNG:', longitude);
      }
      
      const locationPageUrl = location.qrSlug ? `/expedition/${expedition.id}/stop/${location.qrSlug}` : null

      if (!location.isSatellite) {
        routeCoordinates.push([latitude, longitude])
      }

      const marker = L.marker([latitude, longitude], {
        icon: createCustomIcon(isFirst, isLast, location.isSatellite, isCurrent),
      }).addTo(map)

      marker.on('click', () => {
        map.flyTo([latitude, longitude], 7, { duration: 0.6 })
      })

      const popupContent = `
        <div class="location-popup structured-popup">
          <h3>${location.name}</h3>
          
          ${isFirst ? '<div class="location-badge start" style="margin-bottom: 4px;">Starting Point</div>' : ''}
          ${isLast ? '<div class="location-badge end" style="margin-bottom: 4px;">Final Destination</div>' : ''}

          <div class="popup-section">
            <div class="location-dates">
              <strong>${location.isSatellite ? 'Visited' : 'Arrival'}:</strong> ${formatDate(location.arrivalDate)}
              ${location.departureDate ? `<br/><strong>Departure:</strong> ${formatDate(location.departureDate)}` : ''}
            </div>
          </div>
          
          ${locationPageUrl ? `<div class="popup-footer" style="margin-top: 6px;"><a href="${locationPageUrl}" class="location-page-link" style="display: block; text-align: center; width: 100%; font-weight: 600;">See details →</a></div>` : ''}
        </div>
      `

      marker.bindPopup(popupContent)
      markers.push(marker)
    })

    markersRef.current = markers

    if (routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: '#F57702',
        weight: 3,
        opacity: 0.8,
      }).addTo(map)
    }

    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.02))
    }

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [expedition])

  // Auto-scroll the itinerary to the current location row on mount
  useEffect(() => {
    if (currentRowRef.current) {
      setTimeout(() => {
        const row = currentRowRef.current
        if (!row) return
        
        // Find the actual scrollable wrapper
        const scrollContainer = row.closest('.itinerary-overlay') as HTMLElement
        if (scrollContainer) {
          // Calculate target position precisely using viewport rects so it handles 
          // varying padding, sticky headers, and offset parents perfectly
          const containerRect = scrollContainer.getBoundingClientRect()
          const rowRect = row.getBoundingClientRect()
          
          // Current scroll + distance from row to top of container 
          // Offset by approx 140px to leave room for the sticky header (~40px) 
          // plus 1-2 previous rows (~100px) so the current location isn't pinned to the top
          const targetScroll = Math.max(0, scrollContainer.scrollTop + (rowRect.top - containerRect.top) - 140)
          
          scrollContainer.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          })
        } else {
          // Fallback if structure changes
          row.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 400)
    }
  }, [currentIndex])

  return (
    <>
      <div ref={mapContainerRef} className="map-container" />
      {locationsData.length > 0 && (
        <div className="itinerary-overlay">
          <h2 className="itinerary-heading">Itinerary</h2>
          <div className="itinerary-table-wrap">
            <table className="itinerary-table">
              <thead>
                <tr>
                  <th>Arrival</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {locationsData.map((loc, index) => {
                  const href = loc.qrSlug ? `/expedition/${expedition.id}/stop/${loc.qrSlug}` : undefined
                  const isCurrent = index === currentIndex
                  return (
                    <tr
                      key={loc.id ?? index}
                      ref={isCurrent ? currentRowRef : undefined}
                      className={isCurrent ? 'itinerary-row-current' : ''}
                      onClick={() => handleRowClick(index)}
                    >
                      <td>{index === 0 && !loc.isSatellite ? '—' : formatDate(loc.arrivalDate)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: loc.isSatellite ? '1.5rem' : '0' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {loc.isSatellite && (
                              <span style={{ color: '#6B7280', marginRight: '6px', fontSize: '0.875rem' }}>⮑</span>
                            )}
                            {href ? (
                              <a href={href} className={loc.isSatellite ? "itinerary-loc-link satellite-text" : "itinerary-loc-link"}>{loc.name}</a>
                            ) : (
                              <span className={loc.isSatellite ? "itinerary-loc-name satellite-text" : "itinerary-loc-name"}>{loc.name}</span>
                            )}
                            {isCurrent && (
                              <span className="itinerary-now-badge">
                                <span className="itinerary-live-dot" />
                                Now
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
