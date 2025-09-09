import { Router } from "express";
import * as controller from "./subscription.controller";
import { validateBody, createPlanSchema, updatePlanSchema } from "./subscription.validation";
import { authorize } from "../../middlewares/authorize";

const router = Router();


/**
 * @openapi
 * tags:
 *   - name: Plan
 *     description: Plan management (admin only)
 */

// Admin-only CRUD for plans
// router.use(authorize("ADMIN"));

/**
 * @openapi
 * /plans:
 *   get:
 *     tags: [Plan]
 *     summary: List plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 */
router.get("/", controller.listPlans);

/**
 * @openapi
 * /plans:
 *   post:
 *     tags: [Plan]
 *     summary: Create a plan
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanCreate'
 *     responses:
 *       201:
 *         description: Plan created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 */
router.post("/", validateBody(createPlanSchema), controller.createPlan);

/**
 * @openapi
 * /plans/{id}:
 *   get:
 *     tags: [Plan]
 *     summary: Get a plan by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 */
router.get("/:id", controller.getPlan);

/**
 * @openapi
 * /plans/{id}:
 *   put:
 *     tags: [Plan]
 *     summary: Update a plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanUpdate'
 *     responses:
 *       200:
 *         description: Updated plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 */
router.put("/:id", validateBody(updatePlanSchema), controller.updatePlan);

/**
 * @openapi
 * /plans/{id}:
 *   delete:
 *     tags: [Plan]
 *     summary: Delete a plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Plan deleted
 */
router.delete("/:id", controller.removePlan);

export default router;
