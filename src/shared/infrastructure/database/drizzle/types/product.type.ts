import { products } from '../schemas';

export type SelectProductType = typeof products.$inferSelect;
export type InsertProductType = typeof products.$inferInsert;
