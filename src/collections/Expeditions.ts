import type { CollectionConfig } from 'payload';

const Expeditions: CollectionConfig = {
  slug: 'expeditions',
  admin: {
    useAsTitle: 'title',
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