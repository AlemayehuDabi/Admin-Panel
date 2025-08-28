import prisma from "../../config/prisma";
import { JobStatus } from "@prisma/client";

// Create a new job
export const createJob = async (data: {
  title: string;
  description: string;
  requiredSkills: string[];
  jobLocation?: string;
  payRate: number;
  jobType: string;
  startDate: Date;
  duration: Date;
  numbersNeedWorker?: number;
  additionalInfo?: string;
}, companyId: string) => {
  return prisma.job.create({
    data: {
      ...data,
      company: { connect: { id: companyId } },
    },
  });
};

// Update an existing job
export const updateJob = async (jobId: string, data: Partial<{
  title: string;
  description: string;
  requiredSkills: string[];
  jobLocation: string;
  payRate: number;
  jobType: string;
  startDate: Date;
  duration: Date;
  numbersNeedWorker?: number;
  additionalInfo?: string;
  status: JobStatus;
}>) => {
  return prisma.job.update({
    where: { id: jobId },
    data,
  });
};

// Delete a job
export const deleteJob = async (jobId: string) => {
  return prisma.job.delete({ where: { id: jobId } });
};

// Get all jobs with optional filters
export const getJobs = async (filters?: {
  status?: JobStatus;
  companyId?: string;
  jobLocation?: string;
  requiredSkill?: string;
  jobType?: string;
  startDate?: Date;
  duration?: Date;
}) => {
  return prisma.job.findMany({
    where: {
      status: filters?.status,
      companyId: filters?.companyId,
      jobLocation: filters?.jobLocation,
      requiredSkills: filters?.requiredSkill
        ? { has: filters.requiredSkill }
        : undefined,
      jobType: filters?.jobType,
      startDate: filters?.startDate,
      duration: filters?.duration,
    },
    include: {
      company: { include: { user: true } },
      applications: { include: { worker: { include: { user: true } } } },
    },
  });
};

// Get job details by ID
export const getJobById = async (jobId: string) => {
  return prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: { include: { user: true } },
      applications: { include: { worker: { include: { user: true } } } },
    },
  });
};

// Accept a worker application
export const acceptApplication = async (applicationId: string) => {
  return prisma.workerJobApplication.update({
    where: { id: applicationId },
    data: { status: "ACCEPTED" },
  });
};

// Reject a worker application
export const rejectApplication = async (applicationId: string) => {
  return prisma.workerJobApplication.update({
    where: { id: applicationId },
    data: { status: "REJECTED" },
  });
};
