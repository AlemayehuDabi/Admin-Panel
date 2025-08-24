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
 *     summary: Get aggregated user statistics (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts of users grouped by role
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
 *     summary: Get job statistics (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job counts by status and totals
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
 *     summary: Get wallet statistics (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total balances and transaction counts
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
 *     summary: Get referral program statistics (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referral counts per referrer
 *       401:
 *         description: Unauthorized
 */
router.get("/referrals", authenticate, analyticsController.getReferralStats);

export default router;
