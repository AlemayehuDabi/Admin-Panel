import z from "zod";



export const userIdSchema = z.object({
  id: z.uuid("Invalid User Id or Not Found")
});

export const categoryIdSchema = z.object({
  id: z.uuid("Invalid Category Id or Not Found")
});

export const roleIdSchema = z.object({
  id: z.uuid("Invalid Role Id or Not Found")
});

export const specialityIdSchema = z.object({
  id: z.uuid("Invalid Speciality Id or Not Found")
});


export const workerDetailsSchema = z.object({
  skills: z.array(z.string()).optional(),
  // URLs to files
  availability: z.object({
    days: z.object({
      monday: z.boolean().optional(),
      tuesday: z.boolean().optional(),
      wednesday: z.boolean().optional(),
      thursday: z.boolean().optional(),
      friday: z.boolean().optional(),
      saturday: z.boolean().optional(),
      sunday: z.boolean().optional(),
    }).optional(),
    time: z.array(z.enum(["morning", "afternoon", "evening", "night"])).optional(),
  }).optional(),
  category: z.string().optional(),
  professionalRole: z.string().optional(),
  experience: z.string().optional(),
}, "No Worker Details Provided");




export type UserId = z.infer<typeof userIdSchema>;