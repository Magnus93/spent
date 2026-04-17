CREATE TABLE "imports" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"imported_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"account_id" bigint NOT NULL,
	"fingerprint" text NOT NULL,
	"type" text,
	"import_id" bigint NOT NULL,
	"import_order" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"balance" numeric(12, 2) NOT NULL,
	"currency" text,
	"description" text NOT NULL,
	"reference" text,
	"date" timestamp NOT NULL,
	"raw_payload" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_import_id_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_account_fp_idx" ON "transactions" USING btree ("account_id","fingerprint");