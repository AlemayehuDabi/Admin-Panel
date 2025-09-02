// controllers/notificationController.ts
import { Request, Response } from "express";
import { sseManager } from "../../infrastructure/notifications/sseManager";



export const subscribeToNotifications = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }
  const userId = req.user.id; 

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseManager.addClient(userId, res);

  req.on("close", () => {
    sseManager.removeClient(userId);
  });
};
