import { Request, Response } from "express";
import * as walletService from "./wallet.service";

// GET all wallets
export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await walletService.getAllWallets();
    res.json(wallets);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET wallet by user ID
export const getWalletByUserId = async (req: Request, res: Response) => {
  try {
    const wallet = await walletService.getWalletByUserId(req.params.userId);
    res.json(wallet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH adjust wallet balance (admin)
export const adjustWalletBalance = async (req: Request, res: Response) => {
  try {
    const { amount, type } = req.body;
    const wallet = await walletService.adjustWalletBalance(req.params.userId, amount, type);
    res.json(wallet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const transactions = await walletService.getTransactions(req.params.walletId, type as any);
    res.json(transactions);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
