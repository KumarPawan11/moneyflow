import { z } from "zod";

const uuidSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, "Invalid UUID");

export const createTransactionSchema = z.object({
  accountId: uuidSchema.optional().nullable(),
  categoryId: uuidSchema.optional().nullable(),
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense", "transfer"]),
  bucket: z.enum(["needs", "wants", "invested", "income", "other"]).default("needs"),
  date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  note: z.string().max(500).optional().nullable(),
  status: z.enum(["completed", "pending"]).default("completed"),
  isLoan: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: uuidSchema,
});

export const getTransactionsFilterSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  categoryId: uuidSchema.optional(),
  accountId: uuidSchema.optional(),
  type: z.enum(["income", "expense", "transfer"]).optional(),
  bucket: z.enum(["needs", "wants", "invested", "income", "other"]).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100),
  type: z.enum(["checking", "savings", "credit_card", "cash", "investment", "other"]).default("checking"),
  balance: z.number().default(0),
  currency: z.string().length(3).default("USD"),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  type: z.enum(["needs", "wants", "invested", "income", "custom"]).default("needs"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export const upsertBudgetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
  targetAmount: z.number().min(0, "Target amount must be non-negative"),
  categoryId: uuidSchema.optional().nullable(),
  needsRatio: z.number().min(0).max(100).default(50),
  wantsRatio: z.number().min(0).max(100).default(30),
  investedRatio: z.number().min(0).max(100).default(20),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsFilterInput = z.infer<typeof getTransactionsFilterSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>;
