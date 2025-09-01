import { Request, Response } from "express";
import { uploadFile, profilePicture } from "./storage.service";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded " });

    const fileKey = `documents/${Date.now()}-${req.file.originalname}`;
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