ALTER TABLE "users" RENAME COLUMN "imageURL" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "job_listings" RENAME COLUMN "organziationId" TO "organizationId";--> statement-breakpoint
ALTER TABLE "job_listings" RENAME COLUMN "experienseLevel" TO "experienceLevel";--> statement-breakpoint
ALTER TABLE "organizations" RENAME COLUMN "imageURL" TO "imageUrl";--> statement-breakpoint
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_organziationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "user_notification_settings" DROP CONSTRAINT "user_notification_settings_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."job_listing_type";--> statement-breakpoint
CREATE TYPE "public"."job_listing_type" AS ENUM('full-time', 'internship', 'part-time');--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "type" SET DATA TYPE "public"."job_listing_type" USING "type"::"public"."job_listing_type";--> statement-breakpoint
ALTER TABLE "job_listings" ADD COLUMN "region" varchar;--> statement-breakpoint
ALTER TABLE "job_listings" ADD COLUMN "countryCode" varchar(2);--> statement-breakpoint
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_settings" ADD CONSTRAINT "user_notification_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_listings_countryCode_index" ON "job_listings" USING btree ("countryCode");