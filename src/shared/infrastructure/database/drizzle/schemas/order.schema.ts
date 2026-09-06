import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { customers } from './customer.schema';
import { orderItems } from './order-item.schema';
import { relations } from 'drizzle-orm';

export const orderStatusEnum = pgEnum('status', [
  'pending',
  'cancelled',
  'confirmed',
  'shipped',
  'delivered',
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),

  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),

  totalAmount: integer('total_amount').notNull(),
  totalCurrency: varchar('total_currency', { length: 3 })
    .notNull()
    .default('USD'),
  status: orderStatusEnum('status').notNull().default('pending'),

  shippingStreet: text('shipping_street').notNull(),
  shippingCity: varchar('shipping_city', { length: 50 }).notNull(),
  shippingPincode: varchar('shipping_pincode', { length: 15 }).notNull(),
  shippingState: varchar('shipping_state', { length: 50 }).notNull(),
  shippingCountry: varchar('shipping_country', { length: 50 }).notNull(),

  trackingId: varchar('tracking_id', { length: 255 }),
  additionalNotes: text('additional_notes'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const orderItemsRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));
