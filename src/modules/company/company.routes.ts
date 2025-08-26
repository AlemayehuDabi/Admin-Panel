import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import validate from "../../middlewares/validate";
import * as companyController from "./company.controller";
import { companyParamsSchema, createCompanySchema, getAllCompaniesSchema } from "./company.validation";


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
router.get("/", authenticate, validate(getAllCompaniesSchema, "query"), companyController.getAllCompanies);

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
router.get("/:id", authenticate, validate(companyParamsSchema, "params"), companyController.getCompanyById);

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
router.patch("/:id/approve", authenticate, validate(companyParamsSchema, "params"), companyController.approveCompany);

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
router.patch("/:id/reject", authenticate, validate(companyParamsSchema, "params"), companyController.rejectCompany);

/**
 * @openapi
 * /company/{id}:
 *   patch:
 *     tags:
 *       - Company
 *     summary: Update company details (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID to update
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company details updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
router.patch("/:id/details", authenticate, validate(companyParamsSchema, "params"), validate(createCompanySchema, "body"), companyController.updateDetail);

export default router;
