CREATE TABLE "batches" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"imported_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"account_id" bigint NOT NULL,
	"fingerprint" text NOT NULL,
	"type" text,
	"batch_id" bigint NOT NULL,
	"order_in_batch" integer NOT NULL,
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
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_account_fp_idx" ON "transactions" USING btree ("account_id","fingerprint");