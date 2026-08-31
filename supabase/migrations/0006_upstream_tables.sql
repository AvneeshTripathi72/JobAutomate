CREATE TABLE IF NOT EXISTS "job_board_postings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "job_title" text NOT NULL,
  "board" text NOT NULL,
  "status" text NOT NULL DEFAULT 'Pending',
  "applicants_count" integer NOT NULL DEFAULT 0,
  "external_url" text,
  "posted_at" timestamp,
  "owner_user_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "vms_connections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "system_name" text NOT NULL,
  "client_name" text NOT NULL,
  "status" text NOT NULL DEFAULT 'Pending',
  "synced_records" integer NOT NULL DEFAULT 0,
  "last_sync_at" timestamp,
  "notes" text,
  "owner_user_id" uuid,
  "created_at" timestamp NOT NULL DEFAULT now()
);
