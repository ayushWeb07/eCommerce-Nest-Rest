import { orders } from '../schemas';

export type SelectOrderType = typeof orders.$inferSelect;
export type InsertOrderType = typeof orders.$inferInsert;
