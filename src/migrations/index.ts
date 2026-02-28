import * as migration_20260228_165411_add_plaque_id from './20260228_165411_add_plaque_id';

export const migrations = [
  {
    up: migration_20260228_165411_add_plaque_id.up,
    down: migration_20260228_165411_add_plaque_id.down,
    name: '20260228_165411_add_plaque_id'
  },
];
