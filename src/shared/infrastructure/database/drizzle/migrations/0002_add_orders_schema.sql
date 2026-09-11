CREATE TYPE "public"."status" AS ENUM('pending', 'cancelled', 'confirmed', 'shipped', 'delivered');--> statement-breakpoint
CREATE TABLE "order-items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_name" varchar(300) NOT NULL,
	"unit_price_amount" integer NOT NULL,
	"unit_price_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"discount_amount" integer,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"total_amount" integer NOT NULL,
	"total_currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	"shipping_street" text NOT NULL,
	"shipping_city" varchar(50) NOT NULL,
	"shipping_pincode" varchar(15) NOT NULL,
	"shipping_state" varchar(50) NOT NULL,
	"shipping_country" varchar(50) NOT NULL,
	"tracking_id" varchar(255),
	"additional_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order-items" ADD CONSTRAINT "order-items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;