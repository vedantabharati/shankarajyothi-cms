import { getPayload } from 'payload'
import configPromise from '@/payload.config'

async function run() {
  try {
    const payload = await getPayload({ config: configPromise })
    const expeditions = await payload.find({
      collection: 'expeditions',
      depth: 2, // Testing to see if satellite locations are populated at depth 2
      limit: 1,
    })

    const exp = expeditions.docs[0]
    if (!exp) {
      console.log('No expedition found')
      return;
    }

    const kolhapur = exp.itinerary?.find(i => typeof i.location === 'object' && i.location?.name === 'Kolhapur')

    console.log(JSON.stringify(kolhapur || 'Kolhapur not found in itinerary', null, 2))
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

run()
