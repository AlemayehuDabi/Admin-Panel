import { Request, Response } from "express";
import * as jobService from "./job.service";

// Create job
export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.createJob(req.body, req.params.companyId);
    res.json(job);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.json(job);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    res.json({ message: "Job deleted", job });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await jobService.getJobs(req.query as any);
    res.json(jobs);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Accept worker application
export const acceptApplication = async (req: Request, res: Response) => {
  try {
    const application = await jobService.acceptApplication(req.params.applicationId);
    res.json(application);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Reject worker application
export const rejectApplication = async (req: Request, res: Response) => {
  try {
    const application = await jobService.rejectApplication(req.params.applicationId);
    res.json(application);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
