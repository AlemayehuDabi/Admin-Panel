// services/notificationService.ts
import { application } from "express";
import prisma from "../../config/prisma";
import { sseManager } from "../../infrastructure/notifications/sseManager";
import { NotificationType } from "@prisma/client"


export class NotificationService {
  static async notifyUser(userId: string, title: string, message: string, type: NotificationType, jobId?: string, applicationId?: string, workerId?: string, companyId?: string) {
    const notification = await prisma.notification.create({
      data: { userId, jobId: jobId || "", title, message, type, applicationId, workerId, companyId },
    });
    sseManager.sendToUser(userId, "notification", notification);
    return notification;
  }

  static async notifyUsers(
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType,
    jobId?: string,
  ) {
    const notifications = await prisma.$transaction(
      userIds.map((id) =>
        prisma.notification.create({
          data: { userId: id, jobId: jobId || "", title, message, type },
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

  // Fetch notifications helpers
  static async getNotificationsForUser() {
    return prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async isRead(notificationId: string) {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return notification;
  }
}

