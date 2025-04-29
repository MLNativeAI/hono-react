CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"path" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
