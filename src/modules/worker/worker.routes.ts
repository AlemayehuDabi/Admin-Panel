import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as workerController from "./worker.controller";
import validate from "@/middlewares/validate";
import { userIdSchema } from "./worker.validation";

const router = Router();

/**
 * @openapi
 * /worker:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all workers (admin)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by user status (e.g. ACTIVE, INACTIVE)
 *       - in: query
 *         name: verification
 *         schema:
 *           type: string
 *         description: Filter by verification status (e.g. APPROVED, PENDING)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workers
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, workerController.getAllWorkers);

/**
 * @openapi
 * /worker/{id}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get worker details by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Worker details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 */
router.get("/:id", validate(userIdSchema, "params"), authenticate, workerController.getWorkerById);

/**
 * @openapi
 * /worker/{id}/approve:
 *   patch:
 *     tags:
 *       - Worker
 *     summary: Approve a worker (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID to approve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Worker approved and user verification set to APPROVED
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 */
router.patch("/:id/approve", validate(userIdSchema, "params"), authenticate, workerController.approveWorker);

/**
 * @openapi
 * /worker/{id}/reject:
 *   patch:
 *     tags:
 *       - Worker
 *     summary: Reject a worker (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID to reject
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Worker rejected and user verification set to REJECTED
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 */
router.patch("/:id/reject", validate(userIdSchema, "params"), authenticate, workerController.rejectWorker);

export default router;
