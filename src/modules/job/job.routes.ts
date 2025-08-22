import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as jobController from "./job.controller";

const router = Router();

/**
 * @openapi
 * /job:
 *   post:
 *     tags:
 *       - Job
 *     summary: Create a new job (authenticated)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requiredSkills
 *               - payRate
 *               - companyId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               payRate:
 *                 type: number
 *               companyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job created
 *       400:
 *         description: Validation error
 */
router.post("/", authenticate, jobController.createJob);

/**
 * @openapi
 * /job/{id}:
 *   patch:
 *     tags:
 *       - Job
 *     summary: Update a job (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               payRate:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 */
router.patch("/:id", authenticate, jobController.updateJob);

/**
 * @openapi
 * /job/{id}:
 *   delete:
 *     tags:
 *       - Job
 *     summary: Delete a job (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to delete
 *     responses:
 *       200:
 *         description: Job deleted
 *       404:
 *         description: Job not found
 */
router.delete("/:id", authenticate, jobController.deleteJob);

/**
 * @openapi
 * /job:
 *   get:
 *     tags:
 *       - Job
 *     summary: Get all jobs (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by job status
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: requiredSkill
 *         schema:
 *           type: string
 *         description: Filter by a required skill
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get("/", authenticate, jobController.getJobs);

/**
 * @openapi
 * /job/{id}:
 *   get:
 *     tags:
 *       - Job
 *     summary: Get job details by ID (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get("/:id", authenticate, jobController.getJobById);

/**
 * @openapi
 * /job/applications/{applicationId}/accept:
 *   patch:
 *     tags:
 *       - Job
 *     summary: Accept a worker application (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID to accept
 *     responses:
 *       200:
 *         description: Application accepted
 *       404:
 *         description: Application not found
 */
router.patch("/applications/:applicationId/accept", authenticate, jobController.acceptApplication);

/**
 * @openapi
 * /job/applications/{applicationId}/reject:
 *   patch:
 *     tags:
 *       - Job
 *     summary: Reject a worker application (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID to reject
 *     responses:
 *       200:
 *         description: Application rejected
 *       404:
 *         description: Application not found
 */
router.patch("/applications/:applicationId/reject", authenticate, jobController.rejectApplication);

export default router;
