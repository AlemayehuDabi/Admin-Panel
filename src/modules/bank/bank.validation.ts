import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createBankSchema = z.object({
  name: z.string().min(2),
  accountName: z.string().min(1),
  accountNo: z.string().min(1),
  type: z.enum(["BANK", "WALLET"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const updateBankSchema = createBankSchema.partial();

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error.format() });
    req.body = result.data;
    next();
  };
}
