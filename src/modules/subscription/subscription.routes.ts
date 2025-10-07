import express from "express";
import * as controller from "./subscription.controller";
import validate from "../../middlewares/validate";
import {  updateSubscriptionSchema, subscriptionIdSchema } from "./subscription.validation";


/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Subscription management
 */
const router = express.Router();


/**
 * @swagger
 * /subscription:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: List of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
router.get("/", controller.listSubscriptions); // query params for filter

/**
 * @swagger
 * /subscription/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 */
router.get("/:id", validate(subscriptionIdSchema), controller.getSubscription);

/**
 * @swagger
 * /subscription/{id}:
 *   patch:
 *     summary: Update a subscription
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: Subscription updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Subscription not found
 */
router.patch("/:id", validate(subscriptionIdSchema, "params"), validate(updateSubscriptionSchema, "body"), controller.updateSubscription);

/**
 * @swagger
 * /subscription/{id}/cancel:
 *   post:
 *     summary: Cancel a subscription
 *     tags: Subscription
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription canceled
 *       404:
 *         description: Subscription not found
 */
router.post("/:id/cancel", validate(subscriptionIdSchema, "params"), controller.cancelSubscription);

/**
 * @swagger
 * /subscription/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       204:
 *         description: Subscription deleted
 *       404:
 *         description: Subscription not found
 */
router.delete("/:id", validate(subscriptionIdSchema, "params"), controller.deleteSubscription);

export default router;
