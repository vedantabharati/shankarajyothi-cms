import type { CollectionConfig } from 'payload';
import path from 'path';

const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: 'alt',
    description: 'Expedition and location tour photos, stored on Hostinger filesystem.',
  },
  upload: {
    staticDir: process.env.PHOTO_STORAGE_DIR || path.resolve('photos_storage'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
};

export default Photos;
