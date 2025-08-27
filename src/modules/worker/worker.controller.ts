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

export const getCategoriesController = async (req: Request, res: Response) => {
  const categories = await workerService.getCategories()
  res.json(categories)
}

export const getRolesController = async (req: Request, res: Response) => {
  const roles = await workerService.getRoles()
  res.json(roles)
}

export const getRolesByCategoryController = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const roles = await workerService.getRolesByCategory(categoryId);
  res.json(roles);
};

export const getSpecialitiesController = async (req: Request, res: Response) => {
  const specialities = await workerService.getSpecialities()
  res.json(specialities)
}

export const getSpecialitiesByRoleIdController = async (req: Request, res: Response) => {
  const { roleId } = req.params;
  const specialities = await workerService.getSpecialitiesByRoleId(roleId);
  res.json(specialities);
}

export const getWorkTypesController = async (req: Request, res: Response) => {
  const workTypes = await workerService.getWorkTypes()
  res.json(workTypes)
}

export const getWorkTypesBySpecialityIdController = async (req: Request, res: Response) => {
  const { specialityId } = req.params;
  const workTypes = await workerService.getWorkTypesBySpecialityId(specialityId);
  res.json(workTypes);
}