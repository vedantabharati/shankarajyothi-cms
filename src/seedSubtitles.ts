import { getPayload } from 'payload'
import configPromise from './payload.config'

const subtitles: Record<string, string> = {
  'Ahmedabad': 'A vital center of Advaita learning on the Sabarmati, hosting profound Shankarajayanti celebrations in honor of Adi Shankaracharya.',
  'Ajmer': 'Gateway to the sacred Brahma Temple of Pushkar, reflecting Adi Shankaracharya\'s unifying Panchayatana vision of universal divinity.',
  'Amritsar': 'Spreading Adi Shankaracharya\'s timeless message of Ekatmatva and spiritual harmony in the sacred region of Punjab.',
  'Anantnag': 'An ancient Shiva shrine region in the Kashmir valley, echoing Adi Shankaracharya\'s deep philosophical connection to Kashmir Shaivism.',
  'Barmer': 'Bringing the spiritual light of Advaita Vedanta, championed by Adi Shankaracharya, to the resilient desert communities of western Rajasthan.',
  'Beed': 'An extended spiritual halt for Ramotsava celebrations, uniting scholars and local communities under the vision of Adi Shankaracharya.',
  'Belavadi': 'A historic kshetra graced and sanctified by the divine presence of Adi Shankaracharya at the Udbhava Ganapati Temple.',
  'Bhavnagar': 'A coastal transit point spreading Adi Shankaracharya\'s vision of Ekatmatva towards the sacred western coast of Kathiawar.',
  'Bhuj': 'Gateway to the ancient Narayana Sarovara, carrying Adi Shankaracharya\'s message of cultural unity to the frontiers of Kutch.',
  'Bikaner': 'Fostering the spirit of national spiritual integration across the vibrant desert landscapes of Rajasthan, inspired by Adi Shankaracharya.',
  'Chandigarh': 'Gateway to the Himalayas, echoing the timeless truths of Sanatana Dharma championed by Adi Shankaracharya towards the northern peaks.',
  'Chikkamagaluru': 'The supremely sacred district where Adi Shankaracharya arrived at Sringeri and established the Dakshinamnaya Sharada Peetham to anchor Advaita Vedanta.',
  'Dwarka': 'The sacred seat of the Kalika Matha (Western Amnaya Peetham) established by Adi Shankaracharya to protect Dharma in the west.',
  'Horanadu & Kalasa': 'Sanctified by Adi Shankaracharya\'s divine presence, where he empowered the Annapoorneshwari Temple by consecrating the Sri Chakra.',
  'Jaipur': 'A major cultural center uniting communities under Adi Shankaracharya\'s profound vision of cultural and spiritual unity.',
  'Jaisalmer': 'Connecting the western frontiers of Bharat through the unbroken spiritual thread of the Shaankara Jyothi expedition in the name of Adi Shankaracharya.',
  'Jalore': 'Fostering spiritual integration at ancient temple stops along the Thar desert yatra route, carrying the legacy of Adi Shankaracharya.',
  'Jamnagar': 'A transit halt carrying the light of Advaita and the resonant chanting of Rama Nama towards the sacred city of Dwarka, established by Adi Shankaracharya.',
  'Jodhpur': 'Engaging the communities of the Marwar region with the unifying philosophical vision of Adi Shankaracharya.',
  'Junagadh': 'An ancient pilgrimage center at Mount Girnar, reflecting the timeless Vedic heritage championed and systematized by Adi Shankaracharya.',
  'Karanja': 'A historic center of philosophical traditions, serving as a vital spiritual connector on the yatra in the spirit of Adi Shankaracharya.',
  'Kolhapur': 'The sacred Mahalakshmi Shakti Peetha, deeply connected to Adi Shankaracharya through his composition of the Kanakadhara Stotram.',
  'Kota': 'Spreading Adi Shankaracharya\'s unifying message of Ekatmatva along the ancient banks of the Chambal river.',
  'K R Nagar': 'The highly auspicious starting point of the Shaankara Jyothi Prakasha yatra, where the historic journey to spread Adi Shankaracharya\'s vision begins.',
  'Kumta': 'A coastal stopover carrying the spiritual legacy of the Western Ghats and the Sringeri Matha of Adi Shankaracharya northwards.',
  'Kurukshetra': 'The sacred land of the Bhagavad Gita, the foundational text of Advaita Vedanta commented upon extensively by Adi Shankaracharya.',
  'Ludhiana': 'Engaging the industrious communities of Punjab with the enduring and unifying vision of Adi Shankaracharya.',
  'Mount Abu / Ambaji': 'The revered Ambaji Shakti Peetha, celebrating the Divine Mother deeply venerated by Adi Shankaracharya in the Soundarya Lahari.',
  'Nanded': 'Home to the Aundha Nagnath Jyotirlinga, explicitly glorified in the Dwadasa Jyotirlinga Stotram authored by Adi Shankaracharya.',
  'Nashik': 'Home to the Trimbakeshwar Jyotirlinga, recognized and revered as a supreme Shiva shrine in Adi Shankaracharya\'s Dwadasa Jyotirlinga Stotram.',
  'Pandharpur': 'The sacred Vitthal kshetra on the Chandrabhaga river, philosophically meditated upon by Adi Shankaracharya in his beautiful Pandurangashtakam.',
  'Ponda': 'Reflecting the extraordinary resilience of Sanatana Dharma through the preservation of ancient Hindu temple traditions upheld by the followers of Adi Shankaracharya.',
  'Ramtek': 'Ancient Vakataka-era shrines echoing the timeless Vedic heritage preserved and systematized by the tradition of Adi Shankaracharya.',
  'Ratnagiri': 'A crucial coastal gateway bringing the profound philosophical message of the Sringeri Sharada Peetham, established by Adi Shankaracharya, into Maharashtra.',
  'Rohtak': 'A key cultural transit point in Haryana promoting national spiritual integration and the preservation of traditions championed by Adi Shankaracharya.',
  'Sajjangad': 'A sacred hilltop fort reflecting the unbroken continuity of India\'s saint-philosopher tradition which Adi Shankaracharya helped initiate and define.',
  'Chhatrapati Sambhajinagar': 'Home to the Grishneshwar Jyotirlinga, honored as a supreme center of Shaiva pilgrimage in Adi Shankaracharya\'s Jyotirlinga Stotram.',
  'Shimoga': 'The gateway to the Malnad region, intimately connected to the spiritual, cultural, and monastic heritage of the nearby Sringeri Sharada Peetham founded by Adi Shankaracharya.',
  'Solapur': 'A vital center of traditional heritage and devotion, fostering community harmony along the path illuminated by Adi Shankaracharya.',
  'Somnath': 'The eternal first Jyotirlinga, immortalized in the opening invocation "Saurashtre Somanatham cha" of Adi Shankaracharya\'s renowned Dwadasa Jyotirlinga Stotram.',
  'Srinagar': 'The crown jewel of Kashmir, where Adi Shankaracharya ascended the Sarvajnapitha (Throne of Omniscience) at the historic Gopadri hill temple.',
  'Surat': 'Spreading the unifying light of Advaita Vedanta and Ekatmatva through the dynamic communities of South Gujarat in the name of Adi Shankaracharya.',
  'Udaipur': 'Integrating the vast and rich devotional heritage of the Mewar region into the broader narrative of Ekatmatva established by Adi Shankaracharya.',
  'Vadodara': 'Engaging the cultural heartland of Gujarat with the timeless philosophical and unitive vision of Adi Shankaracharya.'
}

async function run() {
  console.log('Starting subtitle seeding...')
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Fetch all locations to map names to IDs
    const locationsResult = await payload.find({
      collection: 'locations',
      limit: 100, // get all
    })

    let updatedCount = 0;
    
    for (const doc of locationsResult.docs) {
      // Find a matching subtitle
      // Sometimes DB names differ slightly from our keys, so we check for includes or exact match
      const docName = doc.name as string
      let matchingSubtitle = subtitles[docName]
      
      if (!matchingSubtitle) {
        // Try fuzzy match
        for (const [key, text] of Object.entries(subtitles)) {
          if (docName.includes(key) || key.includes(docName)) {
            matchingSubtitle = text
            break
          }
        }
      }

      if (matchingSubtitle) {
        console.log(`Updating ${docName}...`)
        await payload.update({
          collection: 'locations',
          id: doc.id,
          data: {
            subtitle: matchingSubtitle,
          },
        })
        updatedCount++
      } else {
        console.warn(`⚠️ No subtitle found for location in DB: "${docName}"`)
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} locations with subtitles!`)
  } catch (err) {
    console.error('Error seeding subtitles:', err)
  }
  process.exit(0)
}

run()
