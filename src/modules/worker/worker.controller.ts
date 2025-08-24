import { Request, Response } from "express";
import * as workerService from "./worker.service";

// GET all workers (with optional filters)
export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const { status, verification } = req.query;
    const workers = await workerService.getAllWorkers({
      status: status as any,
      verification: verification as any,
    });
    res.json(workers);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET worker details by ID
export const getWorkerById = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.getWorkerById(req.params.id);
    res.json(worker);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH approve worker
export const approveWorker = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.approveWorker(req.params.id);
    res.json(worker);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH reject worker
export const rejectWorker = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.rejectWorker(req.params.id);
    res.json(worker);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
