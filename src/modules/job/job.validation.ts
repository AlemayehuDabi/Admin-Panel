import { z } from "zod";

// JobStatus enum (adjust if you have more statuses)
export const JobStatusSchema = z.enum(["OPEN", "CLOSED", "PENDING", "ACCEPTED", "REJECTED"]);

// Create Job schema
export const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Description is required"),
  requiredSkills: z.array(z.string()).nonempty("At least one skill is required"),
  jobLocation: z.string().optional(),
  payRate: z.number().positive("Pay rate must be positive"),
  jobType: z.string().min(1, "Job type is required"),
  startDate: z.coerce.date(),   // coerce handles string → Date
  duration: z.coerce.date(),
  numbersNeedWorker: z.number().int().positive().optional(),
  additionalInfo: z.string().optional(),
});

// Update Job schema (partial of create + status)
export const updateJobSchema = createJobSchema
  .partial()
  .extend({
    status: JobStatusSchema.optional(),
  });

// Job filters schema
export const jobFiltersSchema = z.object({
  status: JobStatusSchema.optional(),
  companyId: z.string().uuid().optional(),
  jobLocation: z.string().optional(),
  requiredSkill: z.string().optional(),
  jobType: z.string().optional(),
  startDate: z.coerce.date().optional(),
  duration: z.coerce.date().optional(),
});

export const jobIdParamSchema = z.object({
    id: z.uuid()
});

export const companyIdParamSchema = z.object({
    companyId: z.uuid()
});