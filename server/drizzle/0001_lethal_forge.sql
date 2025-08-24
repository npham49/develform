CREATE TABLE IF NOT EXISTS "form_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"version_sha" text NOT NULL,
	"description" text,
	"schema" jsonb NOT NULL,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "form_versions_version_sha_unique" UNIQUE("version_sha")
);
--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "live_version_id" integer;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "version_sha" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_versions" ADD CONSTRAINT "form_versions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form_versions" ADD CONSTRAINT "form_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_form_versions_form_id" ON "form_versions" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_form_versions_published" ON "form_versions" USING btree ("form_id","is_published");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_version_sha_form_versions_version_sha_fk" FOREIGN KEY ("version_sha") REFERENCES "public"."form_versions"("version_sha") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
