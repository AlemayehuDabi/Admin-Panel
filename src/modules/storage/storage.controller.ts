import { Request, Response } from "express";
import { uploadFile, profilePicture, paymentReceipt } from "./storage.service";

export const uploadWorkerFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded " });

    const fileKey = `worker/documents/${Date.now()}-${req.file.originalname}`;
    const url = await uploadFile(fileKey, req.file.buffer, req.file.mimetype);

    res.status(201).json({ url });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const uploadCompanyFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded " });

    const fileKey = `company/documents/${Date.now()}-${req.file.originalname}`;
    const url = await uploadFile(fileKey, req.file.buffer, req.file.mimetype);

    res.status(201).json({ url });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileKey = `profile-pictures/${Date.now()}-${req.file.originalname}`;
    const url = await profilePicture(fileKey, req.file.buffer, req.file.mimetype);

    res.status(201).json({ url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadNationalId = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileKey = `worker/national-ids/${Date.now()}-${req.file.originalname}`;
    const url = await profilePicture(fileKey, req.file.buffer, req.file.mimetype);

    res.status(201).json({ url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadPaymentReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileKey = `payment-receipts/${Date.now()}-${req.file.originalname}`;
    const url = await paymentReceipt(fileKey, req.file.buffer, req.file.mimetype);

    res.status(201).json({ url });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


