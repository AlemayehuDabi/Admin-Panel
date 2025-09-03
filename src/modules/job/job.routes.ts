import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as jobController from "./job.controller";
import validate from "../../middlewares/validate";
import { applicationIdParamSchema, assignWorkerParamsSchema, companyIdParamSchema, createJobSchema, jobFiltersSchema, jobIdParamSchema, updateJobSchema } from "./job.validation";

const router = Router();

/**
 * @openapi
 * /job/{companyId}:
 *   post:
 *     tags:
 *       - Job
 *     summary: Create a new job (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID to link the job to
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
 *               - jobType
 *               - startDate
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               jobLocation:
 *                 type: string
 *               payRate:
 *                 type: number
 *               jobType:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: string
 *                 format: date-time
 *               numbersNeedWorker:
 *                 type: integer
 *               additionalInfo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job created
 *       400:
 *         description: Validation error
 */
router.post("/:companyId", authenticate, validate(companyIdParamSchema, "params"), validate(createJobSchema, "body"), jobController.createJob);

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
 *               jobLocation:
 *                 type: string
 *               payRate:
 *                 type: number
 *               jobType:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: string
 *                 format: date-time
 *               numbersNeedWorker:
 *                 type: integer
 *               additionalInfo:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, CLOSED, PENDING, ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: Job updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Job not found
 */
router.patch("/:id", authenticate, validate(jobIdParamSchema, "params"), validate(updateJobSchema, "body"), jobController.updateJob);

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
router.delete("/:id", authenticate, validate(jobIdParamSchema, "params"), jobController.deleteJob);

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
 *           enum: [OPEN, CLOSED, PENDING, ACCEPTED, REJECTED]
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobLocation
 *         schema:
 *           type: string
 *       - in: query
 *         name: requiredSkill
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: duration
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of jobs
 */

router.get("/", authenticate, validate(jobFiltersSchema, "query"), jobController.getJobs);

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
router.get("/:id", authenticate, validate(jobIdParamSchema, "params"), jobController.getJobById);

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
router.patch("/applications/:applicationId/reject", validate(applicationIdParamSchema, "params"), authenticate, jobController.rejectApplication);

/**
 * @swagger
 * /job/{jobId}/assign/{workerId}:
 *   post:
 *     tags:
 *       - Job
 *     summary: Assign a worker to a job (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID to assign the worker to
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID to assign to the job
 *     responses:
 *       200:
 *         description: Worker assigned to job
 *       404:
 *         description: Job or worker not found
 */
router.post("/:jobId/assign/:workerId", validate(assignWorkerParamsSchema, "params"), authenticate, jobController.assignWorkerToJob);

export default router;
