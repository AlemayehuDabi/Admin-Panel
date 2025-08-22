import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as analyticsController from "./analytics.controller";

const router = Router();

/**
 * @openapi
 * /analytics/users:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get user counts grouped by role (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Object with counts per role
 *       401:
 *         description: Unauthorized
 */
router.get("/users", authenticate, analyticsController.getUserStats);

/**
 * @openapi
 * /analytics/jobs:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get job statistics (total, completed, in progress, open)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job statistics object
 *       401:
 *         description: Unauthorized
 */
router.get("/jobs", authenticate, analyticsController.getJobStats);

/**
 * @openapi
 * /analytics/wallets:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get wallet statistics (total balance and transaction counts)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet statistics object
 *       401:
 *         description: Unauthorized
 */
router.get("/wallets", authenticate, analyticsController.getWalletStats);

/**
 * @openapi
 * /analytics/referrals:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get referral counts per referrer (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral counts object
 *       401:
 *         description: Unauthorized
 */
router.get("/referrals", authenticate, analyticsController.getReferralStats);

export default router;
