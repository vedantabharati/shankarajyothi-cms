import type { CollectionConfig } from 'payload';

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i

async function resolveOrientation(url: string): Promise<string> {
  if (url.toLowerCase().includes('/shorts/')) return 'portrait'
  const match = url.match(VIDEO_ID_REGEX)
  const videoId = match ? match[1] : null
  if (!videoId) return 'landscape'
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    if (res.ok) {
      const meta = await res.json()
      if (meta.width && meta.height && meta.height > meta.width) return 'portrait'
    }
  } catch {
    // default to landscape on error
  }
  return 'landscape'
}

async function buildOrientations(videoUrls: string | null | undefined): Promise<string | null> {
  if (!videoUrls) return null
  const urls = videoUrls.split(',').map((u: string) => u.trim()).filter(Boolean)
  const orientations = await Promise.all(urls.map(resolveOrientation))
  return orientations.join(',')
}

const Expeditions: CollectionConfig = {
  slug: 'expeditions',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.itinerary) return data
        data.itinerary = await Promise.all(
          data.itinerary.map(async (item: any) => ({
            ...item,
            videoOrientations: await buildOrientations(item.videoUrls),
            satelliteLocations: item.satelliteLocations
              ? await Promise.all(
                  item.satelliteLocations.map(async (sat: any) => ({
                    ...sat,
                    videoOrientations: await buildOrientations(sat.videoUrls),
                  }))
                )
              : item.satelliteLocations,
          }))
        )
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Expedition Name (e.g., Southern Digvijaya 2024)',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'In Progress', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'planned',
    },
    {
      name: 'itinerary',
      type: 'array',
      label: 'Itinerary',
      admin: {
        description: 'Add locations with their arrival and departure dates in order.',
      },
      fields: [
        {
          name: 'location',
          type: 'relationship',
          relationTo: 'locations',
          required: true,
          label: 'Location',
        },
        {
          name: 'arrivalDate',
          type: 'date',
          required: true,
          label: 'Arrival Date',
        },
        {
          name: 'departureDate',
          type: 'date',
          label: 'Departure Date',
        },
        {
          name: 'videoUrls',
          type: 'text',
          label: 'Video URLs',
          admin: {
            description: 'Link(s) to the YouTube video for this specific stop (e.g., https://youtu.be/...)',
          },
        },
        {
          name: 'videoOrientations',
          type: 'text',
          admin: {
            description: 'Auto-populated: comma-separated orientations (landscape/portrait) matching the order of Video URLs.',
            readOnly: true,
          },
        },
        {
          name: 'photos',
          type: 'upload',
          relationTo: 'photos',
          hasMany: true,
          label: 'Photos',
          admin: {
            description: 'Upload photos taken at this stop.',
          },
        },
        {
          name: 'satelliteLocations',
          type: 'array',
          label: 'Satellite Locations',
          admin: {
            description: 'Places visited around this main location.',
          },
          fields: [
            {
              name: 'location',
              type: 'relationship',
              relationTo: 'locations',
              required: true,
              label: 'Location',
            },
            {
              name: 'date',
              type: 'date',
              label: 'Visit Date',
            },
            {
              name: 'videoUrls',
              type: 'text',
              label: 'Video URLs',
              admin: {
                description: 'Link(s) to the YouTube video for this specific satellite stop',
              },
            },
            {
              name: 'videoOrientations',
              type: 'text',
              admin: {
                description: 'Auto-populated: comma-separated orientations matching the order of Video URLs.',
                readOnly: true,
              },
            },
            {
              name: 'photos',
              type: 'upload',
              relationTo: 'photos',
              hasMany: true,
              label: 'Photos',
              admin: {
                description: 'Upload photos taken at this satellite location.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Objective & Findings Summary',
    },
  ],
};

export default Expeditions;