'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Expedition } from '@/payload-types'

export default function YatraTabs({
  upcoming,
  past,
}: {
  upcoming: Expedition[]
  past: Expedition[]
}) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const getCurrentLocation = (expedition: Expedition): string | null => {
    if (!expedition.itinerary || expedition.itinerary.length === 0) return null
    const now = new Date()
    // Find the stop where today falls between arrival and departure
    for (const stop of expedition.itinerary) {
      const arrival = new Date(stop.arrivalDate)
      const departure = stop.departureDate ? new Date(stop.departureDate) : null
      if (now >= arrival && (!departure || now <= departure)) {
        const loc = typeof stop.location === 'object' && stop.location !== null
          ? (stop.location as { name: string }).name
          : null
        return loc
      }
    }
    // If past all stops, show the last one
    const lastStop = expedition.itinerary[expedition.itinerary.length - 1]
    const lastLoc = typeof lastStop.location === 'object' && lastStop.location !== null
      ? (lastStop.location as { name: string }).name
      : null
    return lastLoc
  }

  const renderCard = (expedition: Expedition, completed?: boolean) => {
    const currentLocation = !completed ? getCurrentLocation(expedition) : null

    return (
      <Link href="/expedition" key={expedition.id} className="yatra-card">
        <div className="yatra-card-title">{expedition.title}</div>
        <div className="yatra-card-summary">
          Tracing the footsteps of Adi Shankaracharya from Karnataka across the length and breadth of Bharata — covering hundreds of locations over the coming year.
        </div>
        {currentLocation && (
          <div className="yatra-current-location">
            <span className="live-dot" />
            Currently at: <strong>{currentLocation}</strong>
          </div>
        )}
        <div className="yatra-card-meta">
          {completed && (
            <span className="yatra-card-status status-completed">Completed</span>
          )}
          <span className="yatra-card-cta">View Map & Itinerary →</span>
        </div>
      </Link>
    )
  }

  return (
    <div className="yatra-tabs">
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Current Yatra
          {upcoming.length > 0 && <span className="tab-count">{upcoming.length}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'past' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Yatras
          {past.length > 0 && <span className="tab-count">{past.length}</span>}
        </button>
      </div>

      <div className="tab-panel">
        {activeTab === 'upcoming' && (
          <>
            {upcoming.length > 0 ? (
              <div className="yatra-cards">
                {upcoming.map((e) => renderCard(e))}
              </div>
            ) : (
              <div className="coming-soon-card">
                <div className="emoji">🕉️</div>
                <p>New yatras will be announced soon</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'past' && (
          <>
            {past.length > 0 ? (
              <div className="yatra-cards">
                {past.map((e) => renderCard(e, true))}
              </div>
            ) : (
              <div className="coming-soon-card">
                <div className="emoji">🙏</div>
                <p>Coming Soon</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
