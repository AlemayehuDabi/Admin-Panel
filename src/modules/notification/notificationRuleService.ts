// services/notificationRuleService.ts
import  prisma  from "../../config/prisma";

export class NotificationRuleService {
  static async getUsersForJob(jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) return [];

    // Find workers that match the job's filters
    const workers = await prisma.user.findMany({
      where: {
        role: "WORKER",
        workerProfile: {
          skills: {
            hasSome: job.requiredSkills,
          },
        },
      },
      select: { id: true },
    });

    return workers.map((w: { id: string }) => w.id);
  }

  // Later you can add rules for events, tasks, groups...
  static async getUsersForEvent(eventId: string) {
    // Similar logic for events
    return [];
  }
}
