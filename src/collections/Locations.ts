import type { CollectionConfig } from 'payload';

const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle / Tagline',
      admin: {
        description: 'A short one-liner shown below the location name on the public page.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Historical Significance',
    },
    {
      name: 'historicalContext',
      type: 'richText',
      label: 'Adi Shankaracharya\'s Visit',
      admin: {
        description: 'Detailed narrative about Adi Shankaracharya\'s visit to this location. This content is displayed on the public location page.',
      },
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
      ],
    },
    {
      name: 'plaqueInstalled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Plaque with QR Code Installed?',
    },
    {
      name: 'qrSlug',
      type: 'text',
      unique: true,
      label: 'QR Code Unique Slug',
      admin: {
        description: 'This will be the unique part of the URL the QR code points to (e.g., kanchi-kamakoti).',
        condition: (data) => data.plaqueInstalled,
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'plaqueId',
      type: 'number',
      unique: true,
      index: true,
      label: 'Physical Plaque ID',
      admin: {
        description: 'The numeric ID printed on the physical QR plaque (e.g., 102).',
        condition: (data) => data.plaqueInstalled,
      },
    },
  ],
};

export default Locations;