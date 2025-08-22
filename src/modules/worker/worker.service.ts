import prisma from "../../config/prisma";
import { VerificationStatus, UserStatus } from "@generated/prisma";

// Get all workers (optionally filter by verification or status)
export const getAllWorkers = async (filters?: {
  verification?: VerificationStatus;
  status?: UserStatus;
}) => {
  return prisma.worker.findMany({
    where: {
      user: {
        verification: filters?.verification,
        status: filters?.status,
      },
    },
    include: {
      user: true,
      licenses: true,
    },
  });
};

// Get worker details by ID
export const getWorkerById = async (workerId: string) => {
  return prisma.worker.findUnique({
    where: { id: workerId },
    include: {
      user: true,
      licenses: true,
    },
  });
};

// Approve a worker (set verification to APPROVED)
export const approveWorker = async (workerId: string) => {
  const worker = await prisma.worker.findUnique({ where: { id: workerId } });
  if (!worker) throw new Error("Worker not found");

  return prisma.user.update({
    where: { id: worker.userId },
    data: { verification: VerificationStatus.APPROVED, status: UserStatus.ACTIVE },
  });
};

// Reject a worker (set verification to REJECTED)
export const rejectWorker = async (workerId: string) => {
  const worker = await prisma.worker.findUnique({ where: { id: workerId } });
  if (!worker) throw new Error("Worker not found");

  return prisma.user.update({
    where: { id: worker.userId },
    data: { verification: VerificationStatus.REJECTED, status: UserStatus.REJECTED },
  });
};

// Approve/reject a specific license
export const approveLicense = async (licenseId: string) => {
  return prisma.license.update({
    where: { id: licenseId },
    data: { /* optional: you could add a verification field if needed */ },
  });
};
