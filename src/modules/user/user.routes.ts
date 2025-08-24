// src/modules/user/user.routes.ts
import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "@/middlewares/authMiddleware";
import { authorize } from "@/middlewares/authorize";
import { errorResponse } from "@/utils/response";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Admin user management endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Simple role gate. Assumes authMiddleware sets req.user = { id, role, tokenVersion? }


router.use(authenticate);
router.use(authorize("ADMIN"));

// GET /admin/users?email=&role=&status=&verification=&dateFrom=&dateTo=&page=&limit=
/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List users with optional filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (contains)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role (e.g. ADMIN, USER)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by user status (e.g. ACTIVE, INACTIVE)
 *       - in: query
 *         name: verification
 *         schema:
 *           type: string
 *         description: Filter by verification status
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: ISO date start for createdAt
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: ISO date end for createdAt
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Users fetched
 */
router.get("/", UserController.list);

// PATCH /admin/users/:id/activate
/**
 * @swagger
 * /admin/users/{id}/activate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Activate a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated
 */
router.patch("/:id/activate", UserController.activate);

// PATCH /admin/users/:id/deactivate
/**
 * @swagger
 * /admin/users/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Deactivate a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.patch("/:id/deactivate", UserController.deactivate);

// POST /admin/users/:id/reset-password   { newPassword: string }
/**
 * @swagger
 * /admin/users/{id}/reset-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset a user's password (admin)
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
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset and sessions invalidated
 *       400:
 *         description: Validation error (e.g. password too short)
 */
router.post("/:id/reset-password", UserController.resetPassword);

// POST /admin/users/:id/force-logout
/**
 * @swagger
 * /admin/users/{id}/force-logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Invalidate all sessions for a user (force logout)
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
 *         description: All sessions invalidated
 */
router.post("/:id/force-logout", UserController.forceLogout);

// POST /admin/users/:id/referral-code/ensure
/**
 * @swagger
 * /admin/users/{id}/referral-code/ensure:
 *   post:
 *     tags:
 *       - Users
 *     summary: Ensure a user has a referral code (create if missing)
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
 *         description: Referral code returned
 */
router.post("/:id/referral-code/ensure", UserController.ensureReferralCode);

// GET /admin/users/:id/referrals
/**
 * @swagger
 * /admin/users/{id}/referrals:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users referred by a given user
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
 *         description: Referred users fetched
 */
router.get("/:id/referrals", UserController.getReferrals);

// GET /admin/users/referral/stats
/**
 * @swagger
 * /admin/users/referral/stats/all:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get overall referral statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral stats fetched
 */
router.get("/referral/stats/all", UserController.referralStats);

export default router;
