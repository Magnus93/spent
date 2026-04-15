CREATE TABLE "accounts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sort" text NOT NULL,
	"account_number" text NOT NULL,
	"type" text NOT NULL,
	"bank" text NOT NULL
);
