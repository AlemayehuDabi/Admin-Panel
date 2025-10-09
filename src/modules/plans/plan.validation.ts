import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createPlanSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().int().nonnegative(), // in cents
  interval: z.enum(["MONTHLY", "YEARLY"]),
  features: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updatePlanSchema = createPlanSchema.partial();

export const idSchema = z.object({
  id: z.uuid(),
});
