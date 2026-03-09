'use client'

import React, { useState } from 'react'
import type { Location } from '@/payload-types'

interface FootprintsClientProps {
  locations: (Location & { href: string })[]
}

export default function FootprintsClient({ locations }: FootprintsClientProps) {
  const [displayCount, setDisplayCount] = useState(6)
  
  const displayedLocations = locations.slice(0, displayCount)

  return (
    <>
      <div className="historical-locations-grid">
        {displayedLocations.map((loc, i) => (
          <a key={i} href={loc.href} className="featured-place-tile">
            <span className="featured-place-name">
              {loc.shortName || loc.name}
            </span>
          </a>
        ))}
      </div>
      
      {displayCount < locations.length && (
        <button 
          onClick={() => setDisplayCount(prev => prev + 6)}
          className="btn btn-secondary"
          style={{ 
            marginTop: '1.5rem', 
            width: '100%', 
            textAlign: 'center', 
            display: 'block',
            padding: '0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb'
            e.currentTarget.style.color = '#111827'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.color = '#4b5563'
          }}
        >
          Show More
        </button>
      )}
    </>
  )
}
