import z from "zod";



export const userIdSchema = z.object({
    userId: z.uuid()
});





export type UserId = z.infer<typeof userIdSchema>;