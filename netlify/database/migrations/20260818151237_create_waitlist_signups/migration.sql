CREATE TABLE "waitlist_signups" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now()
);
