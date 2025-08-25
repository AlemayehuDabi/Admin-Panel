import { Router } from "express";
import * as authController from "./auth.controller";
import validate from "../../middlewares/validate";
import * as validateSchema from "./auth.validation";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request / validation error
 */
router.post("/register", validate(validateSchema.authValidationRegisterSchema, "body"), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful — returns token and user
 *       400:
 *         description: Invalid credentials or account not approved
 */
router.post("/login", validate(validateSchema.authValidationLoginSchema, "body"), authController.login);

/**
 * @openapi
 * /auth/approve/{userId}:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Approve a user's verification (admin only)
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to approve
 *     responses:
 *       200:
 *         description: User approved successfully
 *       400:
 *         description: Bad request or user not found
 *       403:
 *         description: Forbidden — requires admin privileges
 */
router.post("/approve/:userId", validate(validateSchema.authValidationApproveUserSchema, "params"), authController.approveUser);

/**
 * @openapi
 * /auth/reject/{userId}:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reject a user's verification (admin only)
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to reject
 *     responses:
 *       200:
 *         description: User rejected successfully
 *       400:
 *         description: Bad request or user not found
 *       403:
 *         description: Forbidden — requires admin privileges
 */
router.post("/reject/:userId", validate(validateSchema.authValidationApproveUserSchema, "params"), authController.rejectUser);

export default router;
