import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import * as companyController from "./company.controller";

const router = Router();

/**
 * @openapi
 * /company:
 *   get:
 *     tags:
 *       - Company
 *     summary: Get all companies (admin)
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
 *         description: List of companies
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, companyController.getAllCompanies);

/**
 * @openapi
 * /company/{id}:
 *   get:
 *     tags:
 *       - Company
 *     summary: Get company details by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.get("/:id", authenticate, companyController.getCompanyById);

/**
 * @openapi
 * /company/{id}/approve:
 *   patch:
 *     tags:
 *       - Company
 *     summary: Approve a company (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID to approve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company approved and user verification set to APPROVED
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.patch("/:id/approve", authenticate, companyController.approveCompany);

/**
 * @openapi
 * /company/{id}/reject:
 *   patch:
 *     tags:
 *       - Company
 *     summary: Reject a company (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID to reject
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company rejected and user verification set to REJECTED
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.patch("/:id/reject", authenticate, companyController.rejectCompany);

export default router;
