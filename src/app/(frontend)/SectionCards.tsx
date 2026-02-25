'use client'

import { useRef } from 'react'

interface SectionCard {
  title: string
  emoji: string
  body: string
  highlights?: string[]
}

const SECTIONS: SectionCard[] = [
  {
    title: 'About the Initiative',
    emoji: '🕉️',
    body: 'A national cultural and knowledge initiative by Vedanta Bharati to revisit the journeys of Adi Shankaracharya and reconnect contemporary society with his institutional, intellectual, and cultural legacy.',
  },
  {
    title: 'Reconnecting a Network',
    emoji: '🔗',
    body: 'Over twelve centuries ago, Adi Shankara established institutions, strengthened temple traditions, and built enduring cultural networks — still alive today in mutts, temples, manuscripts, and community practices.',
  },
  {
    title: 'The Journey So Far',
    emoji: '📍',
    body: 'Commenced on 9 April 2025 with blessings of the Jagadgurus of Sringeri Sharada Peetham.',
    highlights: ['3 States Covered', '45+ Locations Engaged', '30+ Districts Involved'],
  },
  {
    title: 'At Each Location',
    emoji: '📜',
    body: 'Study of temples, manuscript identification, documentation of oral history, public lectures, cultural programs, and dialogue with local institutions.',
  },
  {
    title: 'The Road Ahead',
    emoji: '🚩',
    body: 'Expanding to 400+ locations across Bharat. Strengthening research, institutional collaborations, and establishing the Adi Shankara Cultural Corridor as a permanent initiative.',
  },
]

export default function SectionCards() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="section-cards-container">
      <h2 className="section-cards-title">About This Initiative</h2>
      <div className="section-cards-scroll" ref={scrollRef}>
        {SECTIONS.map((card, i) => (
          <div key={i} className="section-card">
            <div className="section-card-emoji">{card.emoji}</div>
            <h3 className="section-card-heading">{card.title}</h3>
            <p className="section-card-body">{card.body}</p>
            {card.highlights && (
              <div className="section-card-highlights">
                {card.highlights.map((h, j) => (
                  <span key={j} className="section-card-highlight">{h}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="section-cards-hint">← Swipe to explore →</div>
    </div>
  )
}
