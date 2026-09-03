import { customers } from '../schemas';

export type SelectCustomerType = typeof customers.$inferSelect;
export type InsertCustomerType = typeof customers.$inferInsert;
