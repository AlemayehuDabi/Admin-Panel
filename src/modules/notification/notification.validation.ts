import { z } from "zod";

export const NotificationIdSchema = z.object({
  notificationId: z.string().uuid(),
});