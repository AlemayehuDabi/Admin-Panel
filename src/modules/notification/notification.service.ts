// services/notificationService.ts
import  prisma  from "../../config/prisma";
import { sseManager } from "../../infrastructure/notifications/sseManager";
import { NotificationType } from "@prisma/client"


export class NotificationService {
  static async notifyUser(userId: string, title: string, message: string, type: NotificationType) {
    const notification = await prisma.notification.create({
      data: { userId, title, message, type },
    });

    sseManager.sendToUser(userId, "notification", notification);
    return notification;
  }

  static async notifyUsers(
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType
  ) {
    const notifications = await prisma.$transaction(
      userIds.map((id) =>
        prisma.notification.create({
          data: { userId: id, title, message, type },
        })
      )
    );

    for (const n of notifications) {
      sseManager.sendToUser(n.userId, "notification", n);
    }

    return notifications;
  }

  static async broadcast(message: string, type: string) {
    const notification = { message, type, createdAt: new Date() };
    sseManager.broadcast("notification", notification);
  }
}
