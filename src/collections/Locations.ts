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
      name: 'shortName',
      type: 'text',
      label: 'Short Name (Optional)',
      admin: {
        description: 'A shorter version of the name used for homepage tiles and tight spaces (e.g., "Shantadurga Temple" instead of "Shree Shantadurga Kalangutkarin Temple").',
      },
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
      name: 'state',
      type: 'select',
      label: 'State / Union Territory',
      options: [
        { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
        { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
        { label: 'Assam', value: 'Assam' },
        { label: 'Bihar', value: 'Bihar' },
        { label: 'Chhattisgarh', value: 'Chhattisgarh' },
        { label: 'Goa', value: 'Goa' },
        { label: 'Gujarat', value: 'Gujarat' },
        { label: 'Haryana', value: 'Haryana' },
        { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
        { label: 'Jharkhand', value: 'Jharkhand' },
        { label: 'Karnataka', value: 'Karnataka' },
        { label: 'Kerala', value: 'Kerala' },
        { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
        { label: 'Maharashtra', value: 'Maharashtra' },
        { label: 'Manipur', value: 'Manipur' },
        { label: 'Meghalaya', value: 'Meghalaya' },
        { label: 'Mizoram', value: 'Mizoram' },
        { label: 'Nagaland', value: 'Nagaland' },
        { label: 'Odisha', value: 'Odisha' },
        { label: 'Punjab', value: 'Punjab' },
        { label: 'Rajasthan', value: 'Rajasthan' },
        { label: 'Sikkim', value: 'Sikkim' },
        { label: 'Tamil Nadu', value: 'Tamil Nadu' },
        { label: 'Telangana', value: 'Telangana' },
        { label: 'Tripura', value: 'Tripura' },
        { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
        { label: 'Uttarakhand', value: 'Uttarakhand' },
        { label: 'West Bengal', value: 'West Bengal' },
        { label: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands' },
        { label: 'Chandigarh', value: 'Chandigarh' },
        { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'Dadra and Nagar Haveli and Daman and Diu' },
        { label: 'Delhi', value: 'Delhi' },
        { label: 'Jammu and Kashmir', value: 'Jammu and Kashmir' },
        { label: 'Ladakh', value: 'Ladakh' },
        { label: 'Lakshadweep', value: 'Lakshadweep' },
        { label: 'Puducherry', value: 'Puducherry' },
      ],
      admin: {
        description: 'Select the Indian state or union territory where this location is situated.',
      },
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