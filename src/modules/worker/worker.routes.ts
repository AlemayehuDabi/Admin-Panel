import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as workerController from "./worker.controller";
import validate from "../../middlewares/validate";
import { categoryIdSchema, roleIdSchema, specialityIdSchema, userIdSchema, workerDetailsSchema, createCategory, createRole, createSpeciality, createWorkType } from "./worker.validation";

const router = Router();

/**
 * @openapi
 * /worker/categories:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker categories
 *       401:
 *         description: Unauthorized
 */
router.get("/categories", workerController.getCategoriesController);

/**
 * @openapi
 * /worker/roles:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker roles
 *       401:
 *         description: Unauthorized
 */
router.get("/roles", workerController.getRolesController);

/**
 * @openapi
 * /worker/specialities:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker specialities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker specialities
 *       401:
 *         description: Unauthorized
 */
router.get("/specialities", workerController.getSpecialitiesController);

/**
 * @openapi
 * /worker/work-types:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker work types
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker work types
 *       401:
 *         description: Unauthorized
 */
router.get("/work-types", workerController.getWorkTypesController);

/**
 * @openapi
 * /worker/roles/{categoryId}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker roles by category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker roles by category
 *       401:
 *         description: Unauthorized
 */
router.get("/roles/:categoryId", validate(categoryIdSchema, "params"), workerController.getRolesByCategoryController);

/**
 * @openapi
 * /worker/specialities/{roleId}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker specialities by role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker specialities by role
 *       401:
 *         description: Unauthorized
 */
router.get("/specialities/:roleId", validate(roleIdSchema, "params"), workerController.getSpecialitiesByRoleIdController);

/**
 * @openapi
 * /worker/work-types/{specialityId}:
 *   get:
 *     tags:
 *       - Worker
 *     summary: Get all worker work types by speciality
 *     parameters:
 *       - in: path
 *         name: specialityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Speciality ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of worker work types by speciality
 *       401:
 *         description: Unauthorized
 */
router.get("/work-types/:specialityId", validate(specialityIdSchema, "params"), workerController.getWorkTypesBySpecialityIdController);




/**
 * @openapi
 * /worker/categories:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/categories", validate(createCategory, "body"), workerController.createCategoryController);

/**
 * @openapi
 * /worker/roles:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name
 *               categoryId:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       201:
 *         description: Role created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/roles", validate(createRole, "body"), workerController.createRoleController);

/**
 * @openapi
 * /worker/specialities:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new speciality
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Speciality name
 *               roleId:
 *                 type: string
 *                 description: Role ID
 *     responses:
 *       201:
 *         description: Speciality created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/specialities", validate(createSpeciality, "body"), workerController.createSpecialityController);

/**
 * @openapi
 * /worker/work-types:
 *   post:
 *     tags:
 *       - Worker
 *     summary: Create a new work type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Work type name
 *               specialityId:
 *                 type: string
 *                 description: Speciality ID
 *     responses:
 *       201:
 *         description: Work type created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/work-types", validate(createWorkType, "body"), workerController.createWorkTypeController);




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
