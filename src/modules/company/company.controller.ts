import { NextFunction, Request, Response } from "express";
import * as companyService from "./company.service";
import { successResponse } from "../../utils/response";

type CompanyFilters = {
  q?: string;
  verification?: string;
  status?: string;
  location?: string;
  hasLogo?: boolean;
  hasVerificationDocs?: boolean;
  minJobs?: number;
  maxJobs?: number;
  jobStatus?: string;
  jobCategory?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "jobsCount" | "name" | string; // 👈 allow any string too
  sortOrder?: "asc" | "desc" | string;
};


// GET all companies
export const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // parse / normalize query params
    const {
      q,
      verification,
      status,
      location,
      hasLogo,
      hasVerificationDocs,
      minJobs,
      maxJobs,
      jobStatus,
      jobCategory,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    // in controller
    const rawSortBy = typeof sortBy === "string" ? sortBy : undefined;
    const allowedSorts = ["createdAt", "jobsCount", "name"] as const;
    const sortBySafe = allowedSorts.includes(rawSortBy as any)
      ? (rawSortBy as (typeof allowedSorts)[number])
      : "createdAt";

    const filters: CompanyFilters = {
      q: typeof q === "string" ? q : undefined,
      verification: typeof verification === "string" ? (verification as any) : undefined,
      status: typeof status === "string" ? (status as any) : undefined,
      location: typeof location === "string" ? location : undefined,
      hasLogo: typeof hasLogo === "string" ? hasLogo === "true" : undefined,
      hasVerificationDocs: typeof hasVerificationDocs === "string" ? hasVerificationDocs === "true" : undefined,
      minJobs: typeof minJobs === "string" ? parseInt(minJobs, 10) : undefined,
      maxJobs: typeof maxJobs === "string" ? parseInt(maxJobs, 10) : undefined,
      jobStatus: typeof jobStatus === "string" ? jobStatus : undefined,
      jobCategory: typeof jobCategory === "string" ? jobCategory : undefined,
      page: typeof page === "string" ? Math.max(1, parseInt(page, 10) || 1) : 1,
      limit: typeof limit === "string" ? Math.max(1, Math.min(100, parseInt(limit, 10) || 20)) : 20,
      sortBy: sortBySafe, 
      sortOrder: sortOrder === "asc" ? "asc" : "desc",
    };

    const result = await companyService.getAllCompanies(filters);

    res.json(successResponse(result));
  } catch (err: any) {
    next(err);
  }
};

// GET company details
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.json(successResponse(company, "Company fetched successfully"));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH approve company
export const approveCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.approveCompany(req.params.id);
    res.json(successResponse(company, "Company approved successfully"));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH reject company
export const rejectCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.rejectCompany(req.params.id);
    res.json(successResponse(company, ""));
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH update company detail
export const updateDetail = async (req: Request, res: Response) => {
  try {
    const company = await companyService.updateDetail(req.params.id, req.body);
    res.json(company);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// POST create company
export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.registerCompany(req.body);
    res.status(201).json(company);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

