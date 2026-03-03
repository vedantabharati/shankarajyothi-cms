import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "expeditions_itinerary_satellite_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"location_id" integer NOT NULL,
  	"date" timestamp(3) with time zone,
  	"video_urls" varchar
  );
  
  CREATE TABLE "expeditions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"photos_id" integer
  );
  
  ALTER TABLE "locations" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "locations" ADD COLUMN "historical_context" jsonb;
  ALTER TABLE "expeditions_itinerary" ADD COLUMN "video_urls" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "photos_id" integer;
  ALTER TABLE "expeditions_itinerary_satellite_locations" ADD CONSTRAINT "expeditions_itinerary_satellite_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "expeditions_itinerary_satellite_locations" ADD CONSTRAINT "expeditions_itinerary_satellite_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expeditions_itinerary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expeditions_rels" ADD CONSTRAINT "expeditions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."expeditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expeditions_rels" ADD CONSTRAINT "expeditions_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "photos_updated_at_idx" ON "photos" USING btree ("updated_at");
  CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");
  CREATE UNIQUE INDEX "photos_filename_idx" ON "photos" USING btree ("filename");
  CREATE INDEX "photos_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "photos" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "photos_sizes_card_sizes_card_filename_idx" ON "photos" USING btree ("sizes_card_filename");
  CREATE INDEX "expeditions_itinerary_satellite_locations_order_idx" ON "expeditions_itinerary_satellite_locations" USING btree ("_order");
  CREATE INDEX "expeditions_itinerary_satellite_locations_parent_id_idx" ON "expeditions_itinerary_satellite_locations" USING btree ("_parent_id");
  CREATE INDEX "expeditions_itinerary_satellite_locations_location_idx" ON "expeditions_itinerary_satellite_locations" USING btree ("location_id");
  CREATE INDEX "expeditions_rels_order_idx" ON "expeditions_rels" USING btree ("order");
  CREATE INDEX "expeditions_rels_parent_idx" ON "expeditions_rels" USING btree ("parent_id");
  CREATE INDEX "expeditions_rels_path_idx" ON "expeditions_rels" USING btree ("path");
  CREATE INDEX "expeditions_rels_photos_id_idx" ON "expeditions_rels" USING btree ("photos_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("photos_id");
  ALTER TABLE "expeditions_itinerary" DROP COLUMN "youtube_video";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "expeditions_itinerary_satellite_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "expeditions_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "photos" CASCADE;
  DROP TABLE "expeditions_itinerary_satellite_locations" CASCADE;
  DROP TABLE "expeditions_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_photos_fk";
  
  DROP INDEX "payload_locked_documents_rels_photos_id_idx";
  ALTER TABLE "expeditions_itinerary" ADD COLUMN "youtube_video" varchar;
  ALTER TABLE "locations" DROP COLUMN "subtitle";
  ALTER TABLE "locations" DROP COLUMN "historical_context";
  ALTER TABLE "expeditions_itinerary" DROP COLUMN "video_urls";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "photos_id";`)
}
