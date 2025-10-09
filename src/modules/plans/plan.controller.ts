import { Request, Response, NextFunction } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import * as service from "./plan.service";

export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plan = await service.createPlan(req.body);
    return res.status(201).json(successResponse(plan, "Plan created successfully"));
  } catch (err) {
    if (err instanceof Error && err.message === 'Plan with this name already exists') {
      return res.status(400).json(errorResponse(err.message));
    }
    next(err);
  }
};

export const listPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const take = Number(req.query.take ?? 20);
    const skip = Number(req.query.skip ?? 0);
    const plans = await service.getPlans(take, skip);
    return res.json(successResponse(plans));
  } catch (err) {
    next(err);
  }
};

export const getPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plan = await service.getPlanById(req.params.id);
    if (!plan) return res.status(404).json(errorResponse("Plan not found"));
    return res.json(successResponse(plan));
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plan = await service.updatePlan(req.params.id, req.body);
    return res.json(successResponse(plan));
  } catch (err) {
    next(err);
  }
};

export const removePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deletePlan(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
