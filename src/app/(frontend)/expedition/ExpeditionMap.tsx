'use client'

import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Expedition, Location } from '@/payload-types'

interface ExpeditionMapProps {
  expedition: Expedition
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
}

export default function ExpeditionMap({ expedition }: ExpeditionMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<L.Marker[]>([])

  // Build the itinerary location data for rendering
  const locationsData = (expedition.itinerary || [])
    .map((item, index) => {
      const loc = typeof item.location === 'object' && item.location !== null
        ? (item.location as Location)
        : null
      return {
        index,
        name: loc?.name ?? `Stop ${index + 1}`,
        coordinates: loc?.coordinates,
        arrivalDate: item.arrivalDate,
        departureDate: item.departureDate,
        qrSlug: loc?.qrSlug || null,
        videoUrls: item.videoUrls || null,
        id: item.id,
      }
    })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

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

    const map = L.map(mapContainerRef.current, {
      center: [22.0, 78.0],
      zoom: 5,
      zoomControl: true,
      minZoom: 4,
    })

    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    if (!expedition.itinerary || expedition.itinerary.length === 0) return

    const locationsWithCoords = expedition.itinerary
      .filter((item) => typeof item.location === 'object' && item.location !== null)
      .map((item) => {
        const loc = item.location as Location
        return {
          name: loc.name,
          coordinates: loc.coordinates,
          arrivalDate: item.arrivalDate,
          departureDate: item.departureDate,
          qrSlug: loc.qrSlug || null,
          videoUrls: item.videoUrls || null,
        }
      })
      .filter((loc) => loc.coordinates?.latitude && loc.coordinates?.longitude)

    if (locationsWithCoords.length === 0) return

    const createCustomIcon = (isFirst: boolean, isLast: boolean) => {
      const color = isFirst ? '#10b981' : isLast ? '#F57702' : '#622300'
      const iconHtml = renderToStaticMarkup(
        <div style={{ 
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
        }}>
          <MapPin 
            size={16} 
            color="white" 
            style={{ transform: 'rotate(45deg)' }}
          />
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
      const isFirst = index === 0
      const isLast = index === locationsWithCoords.length - 1
      const locationPageUrl = location.qrSlug ? SLUG_TO_PATH[location.qrSlug] : null

      routeCoordinates.push([latitude, longitude])

      const marker = L.marker([latitude, longitude], {
        icon: createCustomIcon(isFirst, isLast),
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
            <h4 class="popup-section-title">Dates</h4>
            <div class="location-dates">
              <strong>Arrival:</strong> ${new Date(location.arrivalDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              ${
                location.departureDate
                  ? `<br/><strong>Departure:</strong> ${new Date(location.departureDate).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}`
                  : ''
              }
            </div>
          </div>

          ${
            location.videoUrls
              ? `<div class="popup-section">
                  <h4 class="popup-section-title">Media</h4>
                  <div class="popup-videos-list" style="display: flex; gap: 8px; margin-top: 4px;">
                    ${(location.videoUrls as string).split(',').map((url) => `
                      <a href="${url.trim()}" target="_blank" rel="noopener noreferrer" style="display: flex; color: #ff0000;" title="Watch Video">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> 
                      </a>
                    `).join('')}
                  </div>
                </div>`
              : ''
          }
          
          ${locationPageUrl ? `<div class="popup-footer" style="margin-top: 6px;"><a href="${locationPageUrl}" class="location-page-link" style="display: block; text-align: center; width: 100%;">View Location Details →</a></div>` : ''}
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
                  <th>#</th>
                  <th>Location</th>
                  <th>Arrival</th>
                  <th>Departure</th>
                </tr>
              </thead>
              <tbody>
                {locationsData.map((loc, index) => {
                  const href = loc.qrSlug ? SLUG_TO_PATH[loc.qrSlug] : undefined
                  return (
                    <tr key={loc.id ?? index} onClick={() => handleRowClick(index)}>
                      <td className="itinerary-num">{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          {href ? (
                            <a href={href} className="itinerary-loc-link">{loc.name}</a>
                          ) : (
                            <span className="itinerary-loc-name">{loc.name}</span>
                          )}
                          {loc.videoUrls && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {loc.videoUrls.split(',').map((url, i) => (
                                <a key={i} href={url.trim()} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', color: '#ff0000', marginLeft: i === 0 ? '8px' : '0' }} title="Watch Video">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{index === 0 ? '—' : formatDate(loc.arrivalDate)}</td>
                      <td>{loc.departureDate ? formatDate(loc.departureDate) : '—'}</td>
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
