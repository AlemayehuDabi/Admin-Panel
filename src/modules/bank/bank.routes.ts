import { Router } from "express";
import * as controller from "./bank.controller";
import { validateBody, createBankSchema, updateBankSchema } from "./bank.validation";
import { authorize } from "../../middlewares/authorize";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Bank
 *     description: Bank management (admin only)
 */

// All bank routes are admin-only
// router.use(authorize("ADMIN"));

/**
 * @openapi
 * /banks:
 *   get:
 *     tags: [Bank]
 *     summary: List banks
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
 *         description: Array of banks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bank'
 */
router.get("/", controller.listBanks);

/**
 * @openapi
 * /banks:
 *   post:
 *     tags: [Bank]
 *     summary: Create a bank
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankCreate'
 *     responses:
 *       201:
 *         description: Bank created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 */
router.post("/", validateBody(createBankSchema), controller.createBank);

/**
 * @openapi
 * /banks/{id}:
 *   get:
 *     tags: [Bank]
 *     summary: Get a bank by id
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
 *         description: Bank object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 *       404:
 *         description: Bank not found
 */
router.get("/:id", controller.getBank);

/**
 * @openapi
 * /banks/{id}:
 *   patch:
 *     tags: [Bank]
 *     summary: Update a bank
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
 *             $ref: '#/components/schemas/BankUpdate'
 *     responses:
 *       200:
 *         description: Updated bank
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 */
router.patch("/:id", validateBody(updateBankSchema), controller.updateBank);

/**
 * @openapi
 * /banks/{id}:
 *   delete:
 *     tags: [Bank]
 *     summary: Delete a bank
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
 *         description: Bank deleted
 */
router.delete("/:id", controller.deleteBank);

export default router;
