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
        id: item.id,
      }
    })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

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
        <div class="location-popup">
          <h3>${location.name}</h3>
          <p>Sacred pilgrimage site</p>
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
          ${isFirst ? '<div class="location-badge start">Starting Point</div>' : ''}
          ${isLast ? '<div class="location-badge end">Final Destination</div>' : ''}
          ${locationPageUrl ? `<a href="${locationPageUrl}" class="location-page-link">View Location →</a>` : ''}
        </div>
      `

      marker.bindPopup(popupContent)
      markers.push(marker)
    })

    if (routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: '#F57702',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
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
                    <tr key={loc.id ?? index}>
                      <td className="itinerary-num">{index + 1}</td>
                      <td>
                        {href ? (
                          <a href={href} className="itinerary-loc-link">{loc.name}</a>
                        ) : (
                          <span className="itinerary-loc-name">{loc.name}</span>
                        )}
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
