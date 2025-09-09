// src/modules/paymentReceipt/paymentReceipt.validation.ts
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const createReceiptSchema = z.object({
  bankId: z.string().uuid(),
  planId: z.string().uuid().optional(),
  amount: z.number().int().nonnegative(), // in cents (recommended)
  referenceNo: z.string().optional(),
  screenshot: z.string().min(1), // a URL/path to uploaded image (we don't implement file upload here)
});

export const adminRejectSchema = z.object({
  reason: z.string().min(3).optional(),
});


