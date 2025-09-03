import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as workerController from "./worker.controller";
import validate from "../../middlewares/validate";
import { categoryIdSchema, roleIdSchema, specialityIdSchema, userIdSchema, workerDetailsSchema, createCategory, createRole, createSpeciality, createWorkType, workerRegistrationSchema, workerSchema, applicationsSchema, workerIdSchema } from "./worker.validation";

const router = Router();

/**
 * @openapi
 * /workers/categories:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker categories
 *     description: Public endpoint that returns available worker categories
 *     responses:
 *       200:
 *         description: List of worker categories
 */
router.get("/categories", workerController.getCategoriesController);

/**
 * @openapi
 * /workers/roles:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker roles
 *     description: Public endpoint that returns all roles (includes category relation)
 *     responses:
 *       200:
 *         description: List of worker roles
 */
router.get("/roles", workerController.getRolesController);

/**
 * @openapi
 * /workers/specialities:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker specialities
 *     description: Public endpoint that returns all specialities (includes role relation)
 *     responses:
 *       200:
 *         description: List of worker specialities
 */
router.get("/specialities", workerController.getSpecialitiesController);

/**
 * @openapi
 * /workers/work-types:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker work types
 *     description: Public endpoint that returns all work types (includes speciality relation)
 *     responses:
 *       200:
 *         description: List of worker work types
 */
router.get("/work-types", workerController.getWorkTypesController);

/**
 * @openapi
 * /workers/roles/{categoryId}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker roles by category
 *     description: Public endpoint, returns roles that belong to the given categoryId
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID (uuid)
 *     responses:
 *       200:
 *         description: List of worker roles by category
 */
router.get("/roles/:categoryId", validate(categoryIdSchema, "params"), workerController.getRolesByCategoryController);

/**
 * @openapi
 * /workers/specialities/{roleId}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker specialities by role
 *     description: Public endpoint, returns specialities for the provided roleId
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID (uuid)
 *     responses:
 *       200:
 *         description: List of worker specialities by role
 */
router.get("/specialities/:roleId", validate(roleIdSchema, "params"), workerController.getSpecialitiesByRoleIdController);

/**
 * @openapi
 * /workers/work-types/{specialityId}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker work types by speciality
 *     description: Public endpoint, returns work types for the provided specialityId
 *     parameters:
 *       - in: path
 *         name: specialityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Speciality ID (uuid)
 *     responses:
 *       200:
 *         description: List of worker work types by speciality
 */
router.get("/work-types/:specialityId", validate(specialityIdSchema, "params"), workerController.getWorkTypesBySpecialityIdController);




/**
 * @openapi
 * /workers/categories:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new category
 *     description: Create a worker category. This endpoint validates using `createCategory` schema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name (required)
 *               description:
 *                 type: string
 *                 description: Category description (optional)
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/categories", validate(createCategory, "body"), workerController.createCategoryController);

/**
 * @openapi
 * /workers/roles:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new role
 *     description: Create a role and link it to a categoryId (uuid)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name (required)
 *               description:
 *                 type: string
 *                 description: Role description (optional)
 *               categoryId:
 *                 type: string
 *                 description: Category ID (uuid, required)
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post("/roles", validate(createRole, "body"), workerController.createRoleController);

/**
 * @openapi
 * /workers/specialities:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new speciality
 *     description: Create a speciality and link it to a roleId (uuid)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - roleId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Speciality name (required)
 *               description:
 *                 type: string
 *                 description: Speciality description (optional)
 *               roleId:
 *                 type: string
 *                 description: Role ID (uuid, required)
 *     responses:
 *       201:
 *         description: Speciality created successfully
 */
router.post("/specialities", validate(createSpeciality, "body"), workerController.createSpecialityController);

/**
 * @openapi
 * /workers/work-types:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new work type
 *     description: Create a work type and link it to a specialityId (uuid)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specialityId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Work type name (required)
 *               description:
 *                 type: string
 *                 description: Work type description (optional)
 *               specialityId:
 *                 type: string
 *                 description: Speciality ID (uuid, required)
 *     responses:
 *       201:
 *         description: Work type created successfully
 */
router.post("/work-types", validate(createWorkType, "body"), workerController.createWorkTypeController);



/**
 * @openapi
 * /workers:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all workers (admin)
 *     description: Returns workers filtered by supplied query params. This endpoint requires authentication.
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by worker category id (uuid)
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: string
 *         description: Filter by professional role id (uuid)
 *       - in: query
 *         name: specialtyId
 *         schema:
 *           type: string
 *         description: Filter by worker specialty id (uuid)
 *       - in: query
 *         name: workTypeId
 *         schema:
 *           type: string
 *         description: Filter by preferred work type id (uuid)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by job title
 *       - in: query
 *         name: jobLocation
 *         schema:
 *           type: string
 *         description: Filter by job location
 *       - in: query
 *         name: payRate
 *         schema:
 *           type: number
 *         description: Filter by pay rate (minimum)
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *         description: Filter by job type (e.g. Full-time, Part-time, Contract)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by job start date
 *       - in: query
 *         name: requiredSkills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by required skills (multiple values allowed)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workers
 */
router.get("/", authenticate,  workerController.getWorkers);

/**
 * @openapi
 * /workers/{id}:
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
 * /workers/{id}/approve:
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
 * /workers/{id}/reject:
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
 * /workers/{id}/details:
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

/**
 * @openapi
 * /workers/workerRegister:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Register a new worker
 *     description: Creates a new user with a worker profile. Validated by `workerRegistrationSchema`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - role
 *               - category
 *               - professionalRole
 *               - skills
 *               - specialityIds
 *               - workTypeIds
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the worker
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               category:
 *                 type: string
 *               professionalRole:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialityIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               workTypeIds:
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
 *               experience:
 *                 type: string
 *     responses:
 *       201:
 *         description: Worker registered successfully
 *       400:
 *         description: Validation error
 */
router.post("/workerRegister", validate(workerRegistrationSchema, "body"), workerController.registerWorker)


/**
 * @openapi
 * /workers/{workerId}/applications:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get job applications for a specific worker
 *     description: Requires authentication. Returns job applications for the given workerId.
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID (uuid)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of job applications
 *       404:
 *         description: Worker not found
 */
router.get("/:workerId/applications", validate(applicationsSchema, "params"), authenticate, workerController.getWorkerJobApplications);

/**
 * @openapi
 * /workers/{workerId}/applications/{applicationId}/accept:
 *   patch:
 *     tags:
 *       - Worker
 *     summary: Accept a job assignment for a specific application
 *     description: Worker accepts an assignment. Requires authentication.
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID (uuid)
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job application ID (uuid)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job assignment accepted successfully
 *       404:
 *         description: Worker or application not found
 */
router.patch("/:workerId/applications/:applicationId/accept", validate(workerIdSchema, "params"), validate(applicationsSchema, "params"), authenticate, workerController.acceptJobAssignment);

/**
 * @openapi
 * /workers/{workerId}/applications/{applicationId}/reject:
 *   patch:
 *     tags:
 *       - Worker
 *     summary: Reject a job assignment for a specific application
 *     description: Worker rejects an assignment. Requires authentication.
 *     parameters:
 *       - in: path
 *         name: workerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Worker ID (uuid)
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job application ID (uuid)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job assignment rejected successfully
 *       404:
 *         description: Worker or application not found
 */
router.patch("/:workerId/applications/:applicationId/reject", validate(workerIdSchema, "params"), validate(applicationsSchema, "params"), authenticate, workerController.rejectJobAssignment);

export default router;
