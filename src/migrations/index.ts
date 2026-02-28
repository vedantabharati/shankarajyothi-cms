import * as migration_20260228_165411_add_plaque_id from './20260228_165411_add_plaque_id';
import * as migration_20260228_174807_add_expedition_youtube_video from './20260228_174807_add_expedition_youtube_video';

export const migrations = [
  {
    up: migration_20260228_165411_add_plaque_id.up,
    down: migration_20260228_165411_add_plaque_id.down,
    name: '20260228_165411_add_plaque_id',
  },
  {
    up: migration_20260228_174807_add_expedition_youtube_video.up,
    down: migration_20260228_174807_add_expedition_youtube_video.down,
    name: '20260228_174807_add_expedition_youtube_video'
  },
];
