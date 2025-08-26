import { z } from 'zod';

/**
 * Zod schemas for company endpoints.
 *
 * These enums are kept in sync with `prisma/schema.prisma`:
 * - UserStatus: ACTIVE | INACTIVE | PENDING | REJECTED
 * - VerificationStatus: PENDING | APPROVED | REJECTED
 */

export const userStatusEnum = z.enum(["ACTIVE", "INACTIVE", "PENDING", "REJECTED"]);
export const verificationStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

// Query params for GET /company - optional filters
export const getAllCompaniesSchema = z.object({
    status: userStatusEnum.optional(),
    verification: verificationStatusEnum.optional(),
});

// Route params containing company id (UUID)
export const companyParamsSchema = z.object({
    id: z.uuid(),
});

// Approve/Reject endpoints only need the company id
export const approveRejectCompanySchema = companyParamsSchema;

// Minimal create/update company payload
export const createCompanySchema = z.object({
    companyLogo: z
        .union([z.url("Invalid company logo URL"), z.literal("")])
        .optional()
        .nullable(),

    businessLocation: z
        .union([z.string(), z.literal("")])
        .optional()
        .nullable(),

    verificationDocuments: z
        .array(
            z.union([z.url("Invalid verification document URL"), z.literal("")])
        )
        .optional()
        .nullable(),
}, "No data is provided"
);

// Exported TS types
export type GetAllCompaniesInput = z.infer<typeof getAllCompaniesSchema>;
export type CompanyParams = z.infer<typeof companyParamsSchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;