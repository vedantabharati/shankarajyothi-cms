import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_locations_state" AS ENUM('Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry');
  ALTER TABLE "locations" ADD COLUMN "short_name" varchar;
  ALTER TABLE "locations" ADD COLUMN "state" "enum_locations_state";
  ALTER TABLE "expeditions_itinerary_satellite_locations" ADD COLUMN "video_orientations" varchar;
  ALTER TABLE "expeditions_itinerary" ADD COLUMN "video_orientations" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "locations" DROP COLUMN "short_name";
  ALTER TABLE "locations" DROP COLUMN "state";
  ALTER TABLE "expeditions_itinerary_satellite_locations" DROP COLUMN "video_orientations";
  ALTER TABLE "expeditions_itinerary" DROP COLUMN "video_orientations";
  DROP TYPE "public"."enum_locations_state";`)
}
