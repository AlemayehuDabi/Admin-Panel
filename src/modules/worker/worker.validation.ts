import z from "zod";



export const userIdSchema = z.object({
    userId: z.uuid()
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
});




export type UserId = z.infer<typeof userIdSchema>;