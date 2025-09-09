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

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    req.body = result.data;
    return next();
  };
}
