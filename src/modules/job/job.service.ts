import prisma from "../../config/prisma";
import { JobStatus } from "@prisma/client";
import { NotificationService } from "../notification/notification.service";
import { NotificationRuleService } from "../notification/notificationRuleService";
import { sendEmail } from "../../utils/mailer";
import { newJobEmail } from "../../utils/emailTemplates/newJob";

export type GetApplicationsOptions = {
  q?: string;
  skills?: string[]; // matches any skill (hasSome)
  jobLocation?: string;
  jobType?: string;
  jobStatus?: string; // JobStatus
  applicationStatus?: string; // ApplicationStatus (status)
  adminApproved?: string; // ApplicationStatus
  acceptedAssignment?: string; // ApplicationStatus
  appliedFrom?: string; // ISO date
  appliedTo?: string; // ISO date
  payRateMin?: number;
  payRateMax?: number;
  sortBy?: "appliedAt" | "payRate" | "startDate" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};



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
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { user: true },
  });
  if (!company) throw new Error("Company not found");

  const job = await prisma.job.create({
    data: {
      ...data,
      company: { connect: { id: companyId } },
    },
  });

  // Delegate rule matching
  // Fire-and-forget everything
  (async () => {
    try {
      const userIds = await NotificationRuleService.getUsersForJob(job.id);

      if (userIds.length > 0) {
        // Notify in-app
        await NotificationService.notifyUsers(
          userIds,
          "New Job Posted",
          `A new job "${job.title}" matches your profile`,
          "NEW_JOB"
        );

        // Also send email
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { email: true },
        });

        await Promise.all(
          users.map((user) =>
            sendEmail(
              user.email,
              `🚀 New Job Alert: ${job.title} at ${company.user.fullName}`,
              newJobEmail(
                {
                  ...job,
                  jobLocation: job.jobLocation ?? undefined,
                  jobType: job.jobType ?? undefined,
                  startDate: job.startDate ?? undefined,
                  duration: job.duration ?? undefined,
                  additionalInfo: job.additionalInfo ?? undefined,
                },
                company.user.fullName
              )
            )
          )
        );
      }
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();




  return job;
};

// Update an existing job
export const updateJob = async (jobId: string, data: Partial<{
  title: string;
  description: string;
  companyId: string;
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
  if (data.companyId) {
    throw new Error("Cannot change company of the job");
  }
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

export const applyToJob = async (jobId: string, workerId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { company: true } });
  const worker = await prisma.worker.findUnique({ where: { id: workerId } });
  if (!job) throw new Error("Job not found");
  if (!worker) throw new Error("Worker not found");
  const application = await prisma.workerJobApplication.create({ data: { workerId, jobId, status: "PENDING", acceptedAssignment: "ACCEPTED" } });

  (async () => {
    try {
      await NotificationService.notifyUser(
        job.company.userId,
        "New Job Application",
        `A new application has been submitted for your job "${job.title}"`,
        "ALERT",
        job.id,
        application.id,
        application.workerId,
        job.companyId,
      );
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();

  return application;

}

// Accept a worker application
export const acceptApplication = async (applicationId: string) => {
  const updatedApplication = await prisma.workerJobApplication.update({
    where: { id: applicationId },
    data: { status: "ACCEPTED" },
    include: { worker: { include: { user: true } }, job: true }
  });

  (async () => {
    try {
      await NotificationService.notifyUser(
        updatedApplication.worker.userId,
        "Your application has been accepted",
        `Your application for the job "${updatedApplication.job.title}" has been accepted`,
        "ALERT",
        updatedApplication.job.id,
        updatedApplication.id,
        updatedApplication.workerId,
        updatedApplication.job.companyId,
      );
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();

  return updatedApplication;
};

// Reject a worker application
export const rejectApplication = async (applicationId: string) => {
  const updatedApplication = await prisma.workerJobApplication.update({
    where: { id: applicationId },
    data: { status: "REJECTED" },
    include: { worker: { include: { user: true } }, job: true }
  });

  (async () => {
    try {
      await NotificationService.notifyUser(
        updatedApplication.worker.userId,
        "Your application has been rejected",
        `Your application for the job "${updatedApplication.job.title}" has been rejected`,
        "ALERT",
        updatedApplication.job.id,
        updatedApplication.id,
        updatedApplication.workerId,
        updatedApplication.job.companyId
      );
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();

  return updatedApplication;
};

export const assignWorkerToJob = async (jobId: string, workerId: string) => {

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  const worker = await prisma.worker.findUnique({ where: { id: workerId } });
  const pendingAssignment = await prisma.workerJobApplication.findFirst({ where: { jobId, workerId, status: "PENDING" } });
  if (pendingAssignment) {
    throw new Error("Worker has a pending application for this job");
  }

  if (!job) throw new Error("Job not found");
  if (!worker) throw new Error("Worker not found");

  const application = await prisma.workerJobApplication.create({
    data: { workerId, jobId, status: "ASSIGNED" },
  });


  (async () => {
    try {
      await NotificationService.notifyUser(
        worker.userId,
        "You have been assigned to a job",
        `You have been assigned to the job "${job.title}"`,
        "JOB_ASSIGNED",
        job.id,
        application.id,
        worker.id,
        job.companyId
      );
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();


  return application;
};

export const adminContractApproval = async (applicationId: string) => {
  const application = await prisma.workerJobApplication.findUnique({ where: { id: applicationId }, include: { worker: { include: { user: true } }, job: true } })
  if (!application) throw new Error("Application not found");
  const updatedApplication = await prisma.workerJobApplication.update({
    where: { id: applicationId },
    data: {
      adminApproved: "ACCEPTED"
    }
  });

  (async () => {
    try {
      await NotificationService.notifyUser(
        application.worker.userId,
        "Your application has been approved",
        `Your application for the job "${application.job.title}" has been approved`,
        "ALERT",
        application.job.id,
        application.id,
        application.workerId,
        application.job.companyId
      );
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();

  return updatedApplication;
}

export const adminContractRejection = async (applicationId: string) => {
  const application = await prisma.workerJobApplication.findUnique({ where: { id: applicationId }, include: { worker: { include: { user: true } }, job: true } })
  if (!application) throw new Error("Application not found");
  const updatedApplication = await prisma.workerJobApplication.update({
    where: { id: applicationId },
    data: {
      adminApproved: "REJECTED"
    }
  });

  (async () => {
    try {
      await NotificationService.notifyUser(
        application.worker.userId,
        "Your application has been rejected",
        `Your application for the job "${application.job.title}" has been rejected`,
        "ALERT",
        application.job.id,
        application.id,
        application.workerId,
        application.job.companyId
      );
    } catch (err) {
      console.error("Notification failed:", err);
    }
  })();

  return updatedApplication;
}


export const getApplicationsByJob = async (jobId: string) => {
  return prisma.workerJobApplication.findMany({
    where: { jobId },
    include: { worker: { include: { user: true } } },
  });
}

export const getAllApplications = async (opts: GetApplicationsOptions = {}) => {
  const {
    q,
    skills,
    jobLocation,
    jobType,
    jobStatus,
    applicationStatus,
    adminApproved,
    acceptedAssignment,
    appliedFrom,
    appliedTo,
    payRateMin,
    payRateMax,
    sortBy = "appliedAt",
    sortOrder = "desc",
    page = 1,
    limit = 20,
  } = opts;

  const where: any = {};

  // Filter application-level statuses
  if (applicationStatus) where.status = applicationStatus;
  if (adminApproved) where.adminApproved = adminApproved;
  if (acceptedAssignment) where.acceptedAssignment = acceptedAssignment;

  // Date range filter on appliedAt
  if (appliedFrom || appliedTo) {
    where.appliedAt = {};
    if (appliedFrom) where.appliedAt.gte = new Date(appliedFrom);
    if (appliedTo) where.appliedAt.lte = new Date(appliedTo);
  }

  // Build nested job filters
  const jobWhere: any = {};
  if (jobLocation) jobWhere.jobLocation = { contains: jobLocation, mode: "insensitive" };
  if (jobType) jobWhere.jobType = jobType;
  if (jobStatus) jobWhere.status = jobStatus;
  if (typeof payRateMin === "number" || typeof payRateMax === "number") {
    jobWhere.payRate = {};
    if (typeof payRateMin === "number") jobWhere.payRate.gte = payRateMin;
    if (typeof payRateMax === "number") jobWhere.payRate.lte = payRateMax;
  }
  if (skills && skills.length > 0) {
    // job.requiredSkills is String[] -> hasSome checks any of provided skills
    jobWhere.requiredSkills = { hasSome: skills };
  }

  // Search across job.title, job.description, company.name
  if (q) {
    const s = q.trim();
    // OR across nested fields
    where.OR = [
      { job: { title: { contains: s, mode: "insensitive" } } },
      { job: { description: { contains: s, mode: "insensitive" } } },
      // company through job relation: job.company.name
      { job: { company: { name: { contains: s, mode: "insensitive" } } } },
    ];
  }

  // If jobWhere has keys, attach it
  if (Object.keys(jobWhere).length > 0) {
    // merge into where.job using AND semantics
    where.job = { ...where.job, ...jobWhere };
  }

  // Sorting mapping
  const orderBy: any[] = [];
  if (sortBy === "payRate") {
    orderBy.push({ job: { payRate: sortOrder } });
  } else if (sortBy === "startDate") {
    orderBy.push({ job: { startDate: sortOrder } });
  } else if (sortBy === "createdAt") {
    orderBy.push({ job: { createdAt: sortOrder } });
  } else {
    // fallback to appliedAt
    orderBy.push({ appliedAt: sortOrder });
  }

  const take = Math.min(100, Math.max(1, limit || 20));
  const skip = (Math.max(1, page || 1) - 1) * take;

  // total count for pagination
  const total = await prisma.workerJobApplication.count({ where });

  // fetch data (include job and job.company for convenience)
  const data = await prisma.workerJobApplication.findMany({
    where,
    include: {
      job: {
        include: {
          company: true,
        },
      },
      worker: true,
    },
    orderBy,
    skip,
    take,
  });

  return {
    data,
    meta: {
      total,
      page: Math.max(1, page || 1),
      limit: take,
      totalPages: Math.ceil(total / take) || 1,
    },
  };
};

export const getAllAssignedJobs = async (workerId?: string, status?: string, adminApproved?: boolean, acceptedAssignment?: boolean) => {
  const where: any = {};
  if (workerId) where.workerId = workerId;
  if (status) where.status = status;
  if (adminApproved) where.adminApproved = adminApproved;
  if (acceptedAssignment) where.acceptedAssignment = acceptedAssignment;
  return prisma.workerJobApplication.findMany({
    where,
    include: {
      job: { include: { company: { include: { user: true } } } },
      worker: { include: { user: true } },
    },
    orderBy: { appliedAt: "desc" },
  });
};

export const getAllCompanyAssignedJobs = async (companyId: string) => {
  return prisma.workerJobApplication.findMany({
    where: { job: { companyId } },
    include: { job: { include: { company: { include: { user: true } } } }, worker: { include: { user: true } } },
    orderBy: { appliedAt: "desc" },
  });
};

export const getAllAssignedJobsForWorker = async (workerId: string) => {
  return prisma.workerJobApplication.findMany({
    where: { workerId },
    include: { job: { include: { company: { include: { user: true } } } }, worker: { include: { user: true } } },
    orderBy: { appliedAt: "desc" },
  });
};

export const getAllAssignedForJobs = async (jobId: string) => {
  return prisma.workerJobApplication.findMany({
    where: { jobId },
    include: { job: { include: { company: { include: { user: true } } } }, worker: { include: { user: true } } },
    orderBy: { appliedAt: "desc" },
  });
};

export const getMyJobHistory = async (workerId: string) => {
  return prisma.workerJobApplication.findMany({
    where: { workerId,  job: { status: "CLOSED" } },
    include: { job: { include: { company: { include: { user: true } } } }, worker: { include: { user: true } } },
    orderBy: { appliedAt: "desc" },
  });
};