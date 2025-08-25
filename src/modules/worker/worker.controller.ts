import { Request, Response } from "express";
import * as workerService from "./worker.service";
import { successResponse, errorResponse } from "../../utils/response";

// GET all workers (with optional filters)
export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const { status, verification } = req.query;
    const workers = await workerService.getAllWorkers({
      status: status as any,
      verification: verification as any,
    });
    res.json(successResponse(workers));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};

// GET worker details by ID
export const getWorkerById = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.getWorkerById(req.params.id);
    res.json(successResponse(worker));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};

// PATCH approve worker
export const approveWorker = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.approveWorker(req.params.id);
    res.json(successResponse(worker));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};

// PATCH reject worker
export const rejectWorker = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.rejectWorker(req.params.id);
    res.json(successResponse(worker));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};

export const updateWorkerDetails = async (req: Request, res: Response) => {
  try {
    const worker = await workerService.upsertWorkerDetails(req.params.id, req.body);
    res.json(successResponse(worker));
  } catch (err: any) {
    res.status(400).json(errorResponse(err.message));
  }
};
