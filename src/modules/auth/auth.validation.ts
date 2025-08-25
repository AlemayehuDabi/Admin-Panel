import { z } from 'zod';
import { UserRole } from '@prisma/client';
import e from 'express';

export const authValidationRegisterSchema = z.object({
    fullName: z.string().min(2).max(100),
    phone: z.string().min(10).max(15).regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }),
    location: z.string().min(2).max(100),
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    role: z.enum([UserRole.ADMIN, UserRole.WORKER, UserRole.COMPANY, UserRole.OWNER, UserRole.BROKER], {
        error: 'Invalid role'
    }),
});

export const authValidationLoginSchema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const authValidationApproveUserSchema = z.object({
    userId: z.uuid({ message: 'Invalid user ID or not found' }),
});



export type AuthValidationInput = z.infer<typeof authValidationRegisterSchema>;
export type AuthValidationLoginInput = z.infer<typeof authValidationLoginSchema>;
export type AuthValidationApproveUserInput = z.infer<typeof authValidationApproveUserSchema>;