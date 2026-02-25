import { getPayload } from 'payload'
import config from '@/payload.config'
import YatraTabs from './YatraTabs'
import './styles.css'

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch all expeditions for the Yatras section
  const expeditions = await payload.find({
    collection: 'expeditions',
    depth: 0,
    limit: 20,
    sort: '-startDate',
  })

  const upcoming = expeditions.docs.filter(
    (e) => e.status === 'planned' || e.status === 'ongoing',
  )
  const past = expeditions.docs.filter((e) => e.status === 'completed')

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg-image">
          <img src="https://uoreykjkwolamxoarmmj.supabase.co/storage/v1/object/public/media-shankarajyothi/shankaracharya.png" alt="Adi Shankaracharya Hero Background" />
          <div className="hero-bg-overlay"></div>
        </div>
        <div className="hero-ornament">☙ ❧</div>
        <h1>SHAANKARA JYOTI PRAKASHA</h1>
        <p className="hero-subtitle">The Adi Shankara Cultural Corridor</p>
        <p className="hero-tagline">
          Retracing Acharya Bhagavatpada Adi Shankaracharya&apos;s journeys across Bharata
          &mdash; connecting knowledge traditions, institutions, and communities through the
          vision of Advaita and Social &amp; National Integration.
        </p>
        <div className="hero-cta">
          <a href="#about" className="btn btn-outline">
            Learn More
          </a>
          <a href="/location" className="btn btn-primary">
            View All Locations
          </a>
        </div>

        {/* Yatras — embedded in hero */}
        <div className="yatras-container" id="yatras">
          <YatraTabs upcoming={upcoming} past={past} />
        </div>
      </section>

      <hr className="section-divider" />

      {/* ===== ABOUT ===== */}
      <div id="about">
        <div className="section">
          <h2 className="section-heading">About the Initiative</h2>
          <p>
            Shaankara Jyoti Prakasha is a national cultural and knowledge initiative undertaken
            by Vedanta Bharati to revisit the journeys of Acharya Bhagavatpada Adi Shankaracharya
            and reconnect contemporary society with the institutional, intellectual, and cultural
            legacy shaped by Adi Shankara&apos;s travels across Bharata.
          </p>
          <p>
            Adi Shankara&apos;s journeys were not merely pilgrimages &mdash; they were movements of
            philosophical dialogue, institutional creation, cultural consolidation, and national
            integration. Through debates, teaching, writing, and institution-building, Adi Shankara
            articulated a shared civilizational vision rooted in Advaita Vedanta and Ekatmatva
            &mdash; the recognition of underlying unity across diversity.
          </p>
          <p>
            Shaankara Jyoti Prakasha seeks to re-engage with this legacy through the creation of
            the Adi Shankara Cultural Corridor &mdash; a structured national effort bringing
            together scholars, manuscripts, temples, institutions, and communities connected with
            Adi Shankara&apos;s journeys and teachings.
          </p>
          <p>
            This initiative understands Adi Shankara&apos;s travels as a continuing civilizational
            process that strengthens cultural continuity and national unity.
          </p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ===== RECONNECTING ===== */}
      <div className="section-alt">
        <div className="section">
          <h2 className="section-heading">Reconnecting a Civilizational Network</h2>
          <p>
            More than twelve centuries ago, Adi Shankara travelled extensively across the Indian
            subcontinent, establishing institutions, strengthening temple traditions, engaging
            scholars, and building enduring intellectual and cultural networks.
          </p>
          <p>
            These networks continue to exist today &mdash; in mutts, temples, manuscript
            traditions, oral histories, and community practices &mdash; often preserved locally
            across regions.
          </p>
          <p>
            Shaankara Jyoti Prakasha seeks to reconnect these living traditions into a coherent
            national cultural network, reflecting Adi Shankara&apos;s vision of Ekatmatva across
            Bharat.
          </p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ===== JOURNEY SO FAR ===== */}
      <div className="section">
        <h2 className="section-heading">The Journey So Far</h2>
        <p>
          The initiative formally commenced on 9 April 2025, with the blessings of the Jagadgurus
          of Sringeri Sharada Peetham and under the leadership of Parama Pujya Sri Sri Shankara
          Bharati Mahaswamiji, and with the goodwill of the heads of the four Amnaya Mutts.
        </p>
        <p>
          Since then, the initiative has completed its foundational phase:
        </p>

        <div className="stats-strip">
          <div className="stat-card">
            <span className="stat-number">3</span>
            <span className="stat-label">States Covered</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">45+</span>
            <span className="stat-label">Locations Engaged</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">30+</span>
            <span className="stat-label">Districts Involved</span>
          </div>
        </div>

        <p>
          Participation from scholars, temple communities, administrators, and devotees.
          This phase has helped establish the research, documentation, and public engagement
          framework for the Cultural Corridor.
        </p>
      </div>

      <hr className="section-divider" />

      {/* ===== CULTURAL CONTINUITY ===== */}
      <div className="section-alt">
        <div className="section">
          <h2 className="section-heading">Cultural Continuity and National Integration</h2>
          <p>
            Shaankara Jyoti Prakasha has already demonstrated its potential as a national
            integration effort grounded in shared civilizational memory, reflecting Adi
            Shankara&apos;s vision.
          </p>
          <p>Across locations, the initiative has brought together:</p>
          <ul className="content-list">
            <li>Traditional scholars and contemporary researchers</li>
            <li>Temple institutions and academic bodies</li>
            <li>Community leaders, youth, and administrators</li>
            <li>Diverse social groups connected through shared cultural memory</li>
          </ul>
          <p>
            In several locations, communities historically brought into the broader cultural
            mainstream through Adi Shankara&apos;s work were invited and honoured, reaffirming the
            inclusive social vision associated with his teachings.
          </p>
          <p>These engagements have helped strengthen:</p>
          <ul className="content-list">
            <li>Inter-community dialogue</li>
            <li>Cultural continuity</li>
            <li>Shared civilizational identity</li>
            <li>National integration through cultural participation</li>
          </ul>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ===== WHAT HAPPENS ===== */}
      <div className="section">
        <h2 className="section-heading">What Happens at Each Location</h2>
        <p>
          Each visit under Shaankara Jyoti Prakasha integrates knowledge, culture, and community
          engagement.
        </p>

        <h3 className="subsection-heading">Knowledge Engagement</h3>
        <ul className="content-list">
          <li>Study of temples and local traditions</li>
          <li>Manuscript identification and preliminary study</li>
          <li>Documentation of oral and institutional memory</li>
          <li>Interaction with scholars and historians</li>
        </ul>

        <h3 className="subsection-heading">Community Engagement</h3>
        <ul className="content-list">
          <li>Public lectures and discussions</li>
          <li>Cultural programs and recitations</li>
          <li>Dialogue with local institutions and communities</li>
        </ul>

        <p>
          Together, these engagements create a meeting point between tradition, scholarship, and
          society, reinforcing Ekatmatva through shared participation.
        </p>
      </div>

      <hr className="section-divider" />

      {/* ===== KNOWLEDGE & DOCUMENTATION ===== */}
      <div className="section-alt">
        <div className="section">
          <h2 className="section-heading">Knowledge and Documentation Effort</h2>
          <p>
            A central pillar of Shaankara Jyoti Prakasha is knowledge creation through field
            engagement.
          </p>
          <p>The initiative is working toward:</p>
          <ul className="content-list">
            <li>
              Identifying locations associated with Adi Shankara through texts and oral traditions
            </li>
            <li>Engaging manuscript traditions connected with Advaita</li>
            <li>Collaborating with scholars, historians, and research institutions</li>
            <li>Creating long-term archival documentation</li>
            <li>
              Building a knowledge repository on Acharya Shankara&apos;s journeys and influence
              across Bharat
            </li>
          </ul>
          <p>
            This effort connects traditional knowledge systems, academic research, and community
            memory.
          </p>
        </div>
      </div>

      <hr className="section-divider" />

      {/* ===== ROAD AHEAD ===== */}
      <div className="section">
        <h2 className="section-heading">The Road Ahead</h2>
        <p>
          Having completed the initial phase, the initiative is now preparing for its national
          expansion phase.
        </p>
        <p>Over the coming period, Shaankara Jyoti Prakasha will:</p>
        <ul className="content-list">
          <li>Cover 400+ locations across Bharat</li>
          <li>Expand research and documentation activities</li>
          <li>Strengthen institutional collaborations</li>
          <li>
            Establish the Adi Shankara Cultural Corridor as a long-term cultural and knowledge
            initiative
          </li>
        </ul>
        <p>
          The vision is to build a national cultural network inspired by Adi Shankara&apos;s
          journeys &mdash; strengthening Ekatmatva across regions, institutions, and communities.
        </p>
      </div>



      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <p>
          An initiative of <span className="org-name">Vedanta Bharati</span>
        </p>
        <p className="tagline">
          Strengthening Ekatmatva across Bharat through the vision of Adi Shankaracharya
        </p>
      </footer>
    </>
  )
}
