import { Request, Response } from "express";
import * as analyticsService from "./analytics.service";

// GET users stats
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getUserStats();
    res.json(stats);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET jobs stats
export const getJobStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getJobStats();
    res.json(stats);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET wallet stats
export const getWalletStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getWalletStats();
    res.json(stats);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET referral stats
export const getReferralStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getReferralStats();
    res.json(stats);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
