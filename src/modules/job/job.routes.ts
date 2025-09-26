import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as jobController from "./job.controller";
import validate from "../../middlewares/validate";
import { applicationIdParamSchema, applyToJobSchema, assignWorkerParamsSchema, companyIdParamForJobsSchema, companyIdParamSchema, createJobSchema, jobFiltersSchema, jobIdParamSchema, listApplicationsSchema, updateJobSchema, workerIdParamSchema } from "./job.validation";
import { authorize } from "../../middlewares/authorize";

const router = Router();

/**
 * @openapi
 * /jobs/{companyId}:
 *   post:
 *     tags:
 *       - Job
 *     summary: Create a new job (authenticated)
 *     description: Creates a job under the given companyId. Validated by `createJobSchema`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (uuid)
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
 *       201:
 *         description: Job created
 *       400:
 *         description: Validation error
 */
router.post("/:companyId", authenticate, validate(companyIdParamSchema, "params"), validate(createJobSchema, "body"), jobController.createJob);

/**
 * @openapi
 * /jobs/{id}:
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
 * /jobs/{id}:
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
 * /jobs:
 *   get:
 *     tags:
 *       - Job
 *     summary: Get all jobs
 *     description: Returns jobs filtered by query params. Requires authentication.
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
 *         description: Company ID (uuid)
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
 * /jobs/{id}:
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
 * /jobs/applications/{applicationId}/accept:
 *   patch:
 *     tags:
 *       - Job
 *     summary: Accept a worker application (authenticated)
 *     description: Accepts a worker application by applicationId. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID (uuid)
 *     responses:
 *       200:
 *         description: Application accepted
 *       404:
 *         description: Application not found
 */
router.patch("/applications/:applicationId/accept", authenticate, jobController.acceptApplication);


/**
 * @openapi
 * /jobs/applications/{applicationId}/reject:
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

router.post("/job/:job/worker/:workerId/apply", validate(applyToJobSchema, "params"), authenticate, jobController.applyToJob)

/**
 * @openapi
 * /jobs/{jobId}/assign/{workerId}:
 *   post:
 *     tags:
 *       - Job
 *     summary: Assign a worker to a job (authenticated)
 *     description: Creates an assignment/application linking a worker to a job. Validates `jobId` and `workerId` as uuids.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID (uuid)
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID (uuid)
 *     responses:
 *       200:
 *         description: Worker assigned to job
 *       404:
 *         description: Job or worker not found
 */
router.post("/:jobId/assign/:workerId", validate(assignWorkerParamsSchema, "params"), authenticate, jobController.assignWorkerToJob);

/**
 * @openapi
 * /api/jobs/applications:
 *   get:
 *     summary: List worker job applications with powerful search & filter
 *     tags:
 *       - Job
 *     description: |
 *       Returns paginated worker job applications with search, filters and pagination.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search across job title, description and company name.
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated list of required skills.
 *       - in: query
 *         name: jobLocation
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *       - in: query
 *         name: jobStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: applicationStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: adminApproved
 *         schema:
 *           type: string
 *       - in: query
 *         name: acceptedAssignment
 *         schema:
 *           type: string
 *       - in: query
 *         name: appliedFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: appliedTo
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: payRateMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: payRateMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [appliedAt, payRate, startDate, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Internal server error
 */
router.get("/applications", validate(listApplicationsSchema, "query"), authenticate, jobController.getApplicationsByJob);

/**
 * /jobs/admin/{applicationId}/approve:
 *   patch:
 *     tags:
 *       - Job
 *     summary: Approve a worker application (admin)
 *     description: Admin endpoint to approve a work contract; requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID (uuid)
 *     responses:
 *       200:
 *         description: Application approved
 *       404:
 *         description: Application not found
 */
router.patch("/admin/:applicationId/approve", authenticate, validate(applicationIdParamSchema, "params"), jobController.approveWorkContract);

/**
 * /jobs/admin/{applicationId}/reject:
 *   patch:
 *     tags:
 *       - Job
 *     summary: Reject a worker application (admin)
 *     description: Admin endpoint to reject a work contract; requires authentication and ADMIN authorization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID (uuid)
 *     responses:
 *       200:
 *         description: Application rejected
 *       404:
 *         description: Application not found
 */
router.patch("/admin/:applicationId/reject", authenticate, authorize("ADMIN"), validate(applicationIdParamSchema, "params"), jobController.rejectWorkContract);

/**
 * @openapi
 * /jobs/assignments:
 *   get:
 *     tags:
 *       - Job-Assignments
 *     summary: Get all job assignments
 *     description: Retrieve a list of all job assignments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of job assignments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/assignments", authenticate, jobController.getAllJobAssignments);

/**
 * @openapi
 * /jobs/assignments/job/{jobId}:
 *   get:
 *     tags:
 *       - Job-Assignments
 *     summary: Get all job assignments for a specific job
 *     description: Retrieve a list of all job assignments for a specific job.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID (uuid)
 *     responses:
 *       200:
 *         description: A list of job assignments for the specified job
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.get("/assignments/job/:jobId", authenticate, validate(jobIdParamSchema, "params"), jobController.getAllJobAssignments);

/**
 * @openapi
 * /jobs/assigned/company/{companyId}:
 *   get:
 *     tags:
 *       - Job-Assignments
 *     summary: Get all assigned jobs for a specific company
 *     description: Retrieve a list of all jobs assigned to workers for a specific company.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (uuid)
 *     responses:
 *       200:
 *         description: A list of jobs assigned to the specified company
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */
router.get("/assigned/company/:companyId", authenticate, validate(companyIdParamForJobsSchema, "params"), jobController.getAllCompanyAssignedJobs);

/**
 * @openapi
 * /jobs/assigned/worker/{workerId}:
 *   get:
 *     tags:
 *       - Job-Assignments
 *     summary: Get all assigned jobs for a specific worker
 *     description: Retrieve a list of all jobs assigned to a specific worker.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID (uuid)
 *     responses:
 *       200:
 *         description: A list of jobs assigned to the specified worker
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Worker not found
 *       500:
 *         description: Internal server error
 */
router.get("/assigned/worker/:workerId", authenticate, validate(workerIdParamSchema, "params"), jobController.getAllWorkerAssignedJobs);



export default router;

