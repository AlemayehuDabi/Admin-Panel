import { Router } from "express";
import { uploadProfilePicture, uploadFileController } from "./storage.controller";
import { upload } from "../../middlewares/upload";
import validate from "../../middlewares/validate";
import { authenticate } from "../../middlewares/authMiddleware";
import {
    uploadFileValidation,
    uploadProfilePictureValidation,
} from "./storage.validation";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     FileResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: URL to the uploaded file
 */

/**
 * @swagger
 * /api/storage/file:
 *   post:
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     tags: [Storage]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */

router.post("/file", upload.single("file"), validate(uploadFileValidation, "file"), uploadFileController);

/**
 * @swagger
 * /api/storage/profile-picture:
 *   post:
 *     summary: Upload a profile picture
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Storage
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */

router.post("/profile-picture", upload.single("file"), validate(uploadProfilePictureValidation, "file"), uploadProfilePicture);

export default router;
