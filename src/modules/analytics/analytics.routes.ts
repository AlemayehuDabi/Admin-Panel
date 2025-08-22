import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as analyticsController from "./analytics.controller";

const router = Router();

// Users stats
router.get("/users", authenticate, analyticsController.getUserStats);

// Jobs stats
router.get("/jobs", authenticate, analyticsController.getJobStats);

// Wallet stats
router.get("/wallets", authenticate, analyticsController.getWalletStats);

// Referral stats
router.get("/referrals", authenticate, analyticsController.getReferralStats);

export default router;
