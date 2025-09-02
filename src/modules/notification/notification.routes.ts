import { Router } from "express";
import { subscribeToNotifications } from "./notification.controller";
import { authenticate } from "../../middlewares/authMiddleware";
import { sseManager } from "../../infrastructure/notifications/sseManager";


const router = Router();


/**
 * @openapi
 * /notifications/stream:
 *   get:
 *     summary: Subscribe to server-sent events stream for notifications
 *     description: Opens a Server-Sent Events (SSE) stream that sends notification events to the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Stream opened successfully. The response is an event stream (text/event-stream).
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: "data: { \"type\": \"notification\", \"payload\": {...} }\n\n"
 *       '401':
 *         description: Unauthorized - missing or invalid authentication token
 */
router.get("/stream", authenticate, subscribeToNotifications);

router.get("/debug/ping", (req, res) => {
  sseManager.broadcast("notification", { message: "Hello from server!" });
  res.json({ ok: true });
});

export default router;
