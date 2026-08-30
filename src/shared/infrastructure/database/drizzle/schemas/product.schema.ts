import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 300 }).notNull(),
  description: text('description').notNull(),
  sku: varchar('sku', { length: 15 }).notNull().unique(),

  priceAmount: integer('price_amount').notNull(),
  priceCurrency: varchar('price_currency', { length: 3 })
    .notNull()
    .default('USD'),

  stock: integer('stock').notNull(),
  lowStockThreshold: integer('low_stock_threshold').notNull(),
  isAvailable: boolean('is_available').notNull().default(true),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
