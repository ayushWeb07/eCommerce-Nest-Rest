CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"sku" varchar(15) NOT NULL,
	"price_amount" integer NOT NULL,
	"price_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"stock" integer NOT NULL,
	"low_stock_threshold" integer NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
