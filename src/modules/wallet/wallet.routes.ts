import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as walletController from "./wallet.controller";

const router = Router();

/**
 * @openapi
 * /wallet:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get all wallets (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wallets with users and transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, walletController.getAllWallets);

/**
 * @openapi
 * /wallet/{userId}:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get wallet details by user ID (admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose wallet to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet object for the user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get("/:userId", authenticate, walletController.getWalletByUserId);

/**
 * @openapi
 * /wallet/{userId}/create:
 *   post:
 *     tags:
 *       - Wallet
 *     summary: Create a wallet for a user (admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID for whom to create the wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/:userId/create", authenticate, walletController.createWallet);

/**
 * @openapi
 * /wallet/{userId}/adjust:
 *   patch:
 *     tags:
 *       - Wallet
 *     summary: Adjust a user's wallet balance (admin)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID whose wallet balance will be adjusted
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 description: Transaction type (e.g. CREDIT, DEBIT)
 *     responses:
 *       200:
 *         description: Updated wallet with transactions
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch("/:userId/adjust", authenticate, walletController.adjustWalletBalance);

/**
 * @openapi
 * /wallet/{walletId}/transactions:
 *   get:
 *     tags:
 *       - Wallet
 *     summary: Get transactions for a wallet (admin)
 *     parameters:
 *       - in: path
 *         name: walletId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallet ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Optional transaction type filter (e.g. CREDIT, DEBIT)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions for the wallet
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get("/:walletId/transactions", authenticate, walletController.getTransactions);

export default router;
