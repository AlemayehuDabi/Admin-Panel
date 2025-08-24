import { z } from 'zod';
import { UserRole, UserStatus, VerificationStatus } from '@generated/prisma';

export const listUsersQuerySchema = z.object({
    email: z.email().optional(),
    role: z.enum(UserRole).optional(),
    status: z.enum(UserStatus).optional(),
    verification: z.enum(VerificationStatus).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    page: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
    limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
});

export const userIdSchema = z.object({
    userId: z.uuid()
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8).max(100),
});