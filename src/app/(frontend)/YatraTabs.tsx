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

  const renderCard = (expedition: Expedition, completed?: boolean) => (
    <Link href="/expedition" key={expedition.id} className="yatra-card">
      <div className="yatra-card-title">{expedition.title}</div>
      {expedition.summary && (
        <div className="yatra-card-summary">{expedition.summary}</div>
      )}
      <div className="yatra-card-meta">
        {expedition.startDate && (
          <span className="yatra-card-dates">
            📅{' '}
            {new Date(expedition.startDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {expedition.endDate && (
              <>
                {' → '}
                {new Date(expedition.endDate).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </>
            )}
          </span>
        )}
        {completed ? (
          <span className="yatra-card-status status-completed">Completed</span>
        ) : (
          expedition.status && expedition.status !== 'planned' && (
            <span className={`yatra-card-status status-${expedition.status}`}>
              {expedition.status}
            </span>
          )
        )}
        <span className="yatra-card-cta">View Map & Itinerary →</span>
      </div>
    </Link>
  )

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
