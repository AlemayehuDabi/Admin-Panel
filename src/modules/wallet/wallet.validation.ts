import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.uuid("Invalid user ID"),
});

export const walletIdSchema = z.object({
    walletId: z.uuid("Invalid wallet ID")
})

export const transactionIdSchema = z.object({
    transactionId: z.uuid("Invalid transaction ID")
})