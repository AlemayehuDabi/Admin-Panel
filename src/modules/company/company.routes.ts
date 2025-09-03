import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import validate from "../../middlewares/validate";
import * as companyController from "./company.controller";
import { companyParamsSchema, createCompanySchema, getAllCompaniesSchema, updateCompanySchema } from "./company.validation";


const router = Router();

/**
 * @openapi
 * /company:
 *   get:
 *     tags:
 *       - Company
 *     summary: Get all companies (admin)
 *     description: Returns companies filtered by optional `status` and `verification` query params.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, REJECTED]
 *         description: Filter by user status
 *       - in: query
 *         name: verification
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get("/", authenticate, validate(getAllCompaniesSchema, "query"), companyController.getAllCompanies);

/**
 * @openapi
 * /company/{id}:
 *   get:
 *     tags:
 *       - Company
 *     summary: Get company details by ID (admin)
 *     description: Returns the company profile for the given company id (uuid).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (uuid)
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */
router.get("/:id", authenticate, validate(companyParamsSchema, "params"), companyController.getCompanyById);

/**
 * @openapi
 * /company/register:
 *   post:
 *     tags:
 *       - Company
 *     summary: Register a new company
 *     description: Creates a new user with role COMPANY. Validated by `createCompanySchema`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *               - email
 *               - password
 *               - location
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               location:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *                 format: uri
 *               businessLocation:
 *                 type: string
 *               verificationDocuments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       201:
 *         description: Company registered successfully
 *       400:
 *         description: Bad request (e.g. validation errors, user already exists)
 */
router.post("/register", validate(createCompanySchema, "body"), companyController.createCompany);

/**
 * @openapi
 * /company/{id}/approve:
 *   patch:
 *     tags:
 *       - Company
 *     summary: Approve a company (admin)
 *     description: Admin endpoint to set company verification to APPROVED. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (uuid)
 *     responses:
 *       200:
 *         description: Company approved
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
 *     description: Admin endpoint to set company verification to REJECTED. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (uuid)
 *     responses:
 *       200:
 *         description: Company rejected
 *       404:
 *         description: Company not found
 */
router.patch("/:id/reject", authenticate, validate(companyParamsSchema, "params"), companyController.rejectCompany);

/**
 * @openapi
 * /company/{id}/details:
 *   patch:
 *     tags:
 *       - Company
 *     summary: Update company details (admin)
 *     description: Upsert company profile fields (companyLogo, businessLocation, verificationDocuments). Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID (uuid)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyLogo:
 *                 type: string
 *                 format: uri
 *               businessLocation:
 *                 type: string
 *               verificationDocuments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       200:
 *         description: Company details updated
 *       404:
 *         description: Company not found
 */
router.patch("/:id/details", authenticate, validate(companyParamsSchema, "params"), validate(updateCompanySchema, "body"), companyController.updateDetail);


export default router;
