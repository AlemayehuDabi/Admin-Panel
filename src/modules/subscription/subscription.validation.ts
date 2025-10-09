// validators/subscription.validator.ts
import { z } from "zod";

export const createSubscriptionSchema = z.object({
  userId: z.string().uuid(),
  planId: z.string().uuid(),
  startDate: z.string().optional(), // ISO date string (optional)
  endDate: z.string().optional().nullable(),
  autoRenew: z.boolean().optional(),
  status: z.string().optional(),
});

export const updateSubscriptionSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  autoRenew: z.boolean().optional(),
  status: z.string().optional(),
});

export const subscriptionIdSchema = z.object({
  id: z.string().uuid(),
});
