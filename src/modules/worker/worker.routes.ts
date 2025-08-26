import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as workerController from "./worker.controller";
import validate from "../../middlewares/validate";
import { userIdSchema, workerDetailsSchema } from "./worker.validation";

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

/**
 * @openapi
 * /worker/{id}/details:
 *   patch:
 *     tags:
 *       - Worker
 *     summary: Create or update worker profile details (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID for the worker profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               portfolio:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               availability:
 *                 type: object
 *                 properties:
 *                   days:
 *                     type: object
 *                     properties:
 *                       monday:
 *                         type: boolean
 *                       tuesday:
 *                         type: boolean
 *                       wednesday:
 *                         type: boolean
 *                       thursday:
 *                         type: boolean
 *                       friday:
 *                         type: boolean
 *                       saturday:
 *                         type: boolean
 *                       sunday:
 *                         type: boolean
 *                   time:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: [morning, afternoon, evening, night]
 *               category:
 *                 type: string
 *               professionalRole:
 *                 type: string
 *               experience:
 *                 type: string
 *     responses:
 *       200:
 *         description: Worker details upserted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/details", validate(userIdSchema, "params"), validate(workerDetailsSchema, "body"), authenticate, workerController.updateWorkerDetails);

export default router;
