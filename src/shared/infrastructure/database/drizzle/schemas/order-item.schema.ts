import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { products } from './product.schema';
import { orders } from './order.schema';
import { relations } from 'drizzle-orm';

export const orderItems = pgTable('order-items', {
  id: uuid('id').primaryKey().defaultRandom(),

  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),

  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),

  productName: varchar('product_name', { length: 300 }).notNull(),

  unitPriceAmount: integer('unit_price_amount').notNull(),
  unitPriceCurrency: varchar('unit_price_currency', { length: 3 })
    .notNull()
    .default('USD'),
  discountAmount: integer('discount_amount'),

  quantity: integer('quantity').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ordersRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
