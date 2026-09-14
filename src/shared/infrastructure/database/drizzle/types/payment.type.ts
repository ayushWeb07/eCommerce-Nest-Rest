import { payments } from '../schemas';

export type SelectPaymentType = typeof payments.$inferSelect;
export type InsertPaymentType = typeof payments.$inferInsert;
