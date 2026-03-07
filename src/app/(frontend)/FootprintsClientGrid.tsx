'use client'

import React, { useState } from 'react'

export default function FootprintsClientGrid({ locations }: { locations: { id: string | number, name: string, shortName?: string | null, href: string }[] }) {
  const [visibleCount, setVisibleCount] = useState(6)

  const showMore = () => {
    setVisibleCount(prev => prev + 6)
  }

  const visibleLocations = locations.slice(0, visibleCount)
  const hasMore = visibleCount < locations.length

  return (
    <>
      <div className="historical-locations-grid">
        {visibleLocations.map((loc, i) => (
          <a key={i} href={loc.href} className="featured-place-tile">
            <span className="featured-place-name">
              {loc.shortName || loc.name}
            </span>
          </a>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            onClick={showMore}
            className="btn btn-primary"
            style={{ padding: '0.6rem 2rem', fontSize: '0.95rem' }}
          >
            Show more locations ↓
          </button>
        </div>
      )}
    </>
  )
}
