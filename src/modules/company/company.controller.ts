import { Request, Response } from "express";
import * as companyService from "./company.service";

// GET all companies
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const { status, verification } = req.query;
    const companies = await companyService.getAllCompanies({
      status: status as any,
      verification: verification as any,
    });
    res.json(companies);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// GET company details
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.json(company);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH approve company
export const approveCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.approveCompany(req.params.id);
    res.json(company);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH reject company
export const rejectCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.rejectCompany(req.params.id);
    res.json(company);
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

