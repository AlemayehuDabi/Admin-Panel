import { z } from 'zod';


export const initPaymentSchema = z.object({
amount: z.number().positive({ message: 'amount must be a positive number' }),
currency: z.string().optional().default('ETB'),
email: z.email().optional(),
firstName: z.string().optional(),
lastName: z.string().optional(),
txRef: z.string().optional(),
return_url: z.string().url().optional(),
userId: z.uuid().optional(),
walletId: z.uuid().optional(),
});


export type InitPaymentInput = z.infer<typeof initPaymentSchema>;