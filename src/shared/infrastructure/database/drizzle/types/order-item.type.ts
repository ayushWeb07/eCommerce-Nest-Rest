import { orderItems } from '../schemas';

export type SelectOrderItemType = typeof orderItems.$inferSelect;
export type InsertOrderItemType = typeof orderItems.$inferInsert;
