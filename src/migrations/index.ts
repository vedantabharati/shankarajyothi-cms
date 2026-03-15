import * as migration_20260228_165411_add_plaque_id from './20260228_165411_add_plaque_id';
import * as migration_20260228_174807_add_expedition_youtube_video from './20260228_174807_add_expedition_youtube_video';
import * as migration_20260303_170314_add_photos_collection from './20260303_170314_add_photos_collection';
import * as migration_20260315_161249 from './20260315_161249';

export const migrations = [
  {
    up: migration_20260228_165411_add_plaque_id.up,
    down: migration_20260228_165411_add_plaque_id.down,
    name: '20260228_165411_add_plaque_id',
  },
  {
    up: migration_20260228_174807_add_expedition_youtube_video.up,
    down: migration_20260228_174807_add_expedition_youtube_video.down,
    name: '20260228_174807_add_expedition_youtube_video',
  },
  {
    up: migration_20260303_170314_add_photos_collection.up,
    down: migration_20260303_170314_add_photos_collection.down,
    name: '20260303_170314_add_photos_collection',
  },
  {
    up: migration_20260315_161249.up,
    down: migration_20260315_161249.down,
    name: '20260315_161249'
  },
];
