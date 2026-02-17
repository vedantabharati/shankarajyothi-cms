import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../payload.config';
import locationData from './locations.json';
import expeditionData from './expeditions.json';

const seed = async () => {
  try {
    console.log('🚀 Starting seed script...');
    console.log('📦 Initializing Payload...');
    
    const payload = await getPayload({ config });
    console.log('✅ Payload initialized successfully');

    // 1. Create all Locations and store their IDs mapped by qrSlug
  const locationMap: Record<string, number> = {};
  
  for (const loc of locationData) {
    // Check if location already exists by qrSlug
    const existingLocation = await payload.find({
      collection: 'locations',
      where: {
        qrSlug: {
          equals: loc.qrSlug,
        },
      },
      limit: 1,
    });

    let locationId: number;
    
    if (existingLocation.docs.length > 0) {
      // Location already exists, update it with new data (including coordinates)
      locationId = existingLocation.docs[0].id;
      await payload.update({
        collection: 'locations',
        id: locationId,
        data: loc,
      });
      console.log(`Updated location: ${loc.name} (${loc.qrSlug})`);
    } else {
      // Create new location
      const doc = await payload.create({
        collection: 'locations',
        data: loc,
      });
      locationId = doc.id;
      console.log(`Created location: ${loc.name} (${loc.qrSlug})`);
    }
    
    locationMap[loc.qrSlug] = locationId;
  }

  // 2. Map the itinerary qrSlugs to actual location IDs
  const itineraryWithIds = expeditionData.itinerary.map(item => ({
    location: locationMap[item.qrSlug],
    arrivalDate: item.arrivalDate,
    departureDate: item.departureDate,
  }));

  // 3. Check if Expedition already exists by title
  const existingExpedition = await payload.find({
    collection: 'expeditions',
    where: {
      title: {
        equals: expeditionData.title,
      },
    },
    limit: 1,
  });

  if (existingExpedition.docs.length > 0) {
    console.log(`Expedition "${expeditionData.title}" already exists, skipping...`);
  } else {
    // Create the Expedition with the mapped itinerary
    await payload.create({
      collection: 'expeditions',
      data: {
        title: expeditionData.title,
        startDate: expeditionData.startDate,
        endDate: expeditionData.endDate,
        status: expeditionData.status as 'planned' | 'ongoing' | 'completed',
        itinerary: itineraryWithIds,
        summary: expeditionData.summary,
      },
    });
    console.log(`Created expedition: ${expeditionData.title}`);
  }

    console.log('\n✅ Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
};

seed().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});