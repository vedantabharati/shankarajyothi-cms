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
}

export default function ExpeditionMap({ expedition }: ExpeditionMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Initialize map centered on India
    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
    })

    mapRef.current = map

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    if (!expedition.itinerary || expedition.itinerary.length === 0) return

    // Extract locations with coordinates (only where location is populated, not just an ID)
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

    if (locationsWithCoords.length === 0) {
      return
    }

    // Create custom marker icon using Lucide React
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

    // Add markers for each location
    const markers: L.Marker[] = []
    const routeCoordinates: [number, number][] = []

    locationsWithCoords.forEach((location, index) => {
      const latitude = location.coordinates!.latitude!
      const longitude = location.coordinates!.longitude!
      const isFirst = index === 0
      const isLast = index === locationsWithCoords.length - 1
      const locationPageUrl = location.qrSlug ? SLUG_TO_PATH[location.qrSlug] : null

      // Add to route coordinates
      routeCoordinates.push([latitude, longitude])

      // Create marker
      const marker = L.marker([latitude, longitude], {
        icon: createCustomIcon(isFirst, isLast),
      }).addTo(map)

      // Create popup content
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

    // Draw route polyline
    if (routeCoordinates.length > 1) {
      L.polyline(routeCoordinates, {
        color: '#F57702',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(map)
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    // Cleanup on unmount
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [expedition])

  return (
    <div className="map-wrapper">
      <div ref={mapContainerRef} className="map-container" />
    </div>
  )
}
