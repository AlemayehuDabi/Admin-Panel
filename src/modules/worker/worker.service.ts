import prisma from "../../config/prisma";
import { VerificationStatus, UserStatus } from "@prisma/client";

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

export const upsertWorkerDetails = async (userId: string, data: any) => {
  const { skills = [""], portfolio = [""], availability = {}, category = "", professionalRole = "", experience = "" } = data;

  return prisma.worker.upsert({
    where: { userId }, // unique constraint in schema
    update: {
      skills,
      portfolio,
      availability,
      category,
      professionalRole,
      experience,
    },
    create: {
      userId,
      skills,
      portfolio,
      availability,
      category,
      professionalRole,
      experience,
    },
  });
};

export async function getCategories() {
  return prisma.category.findMany()
}

export async function getRoles() {
  return prisma.role.findMany({
    include: { category: true }
  })
}

export async function getRolesByCategory(categoryId: string) {
  return prisma.role.findMany({
    where: { categoryId },
    include: { category: true }
  })
}

export async function getSpecialities() {
  return prisma.speciality.findMany({
    include: { role: true }
  })
}

export async function getSpecialitiesByRoleId(roleId: string) {
  return prisma.speciality.findMany({
    where: { roleId },
    include: { role: true }
  })
}

export async function getWorkTypes() {
  return prisma.workType.findMany({
    include: { speciality: true }
  })
}

export async function getWorkTypesBySpecialityId(specialityId: string) {
  return prisma.workType.findMany({
    where: { specialityId },
    include: { speciality: true }
  })
}

export const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name }
  })
}

// application/usecases/CreateRole.ts
export const createRole = async (name: string, categoryId: string) => {
  return prisma.role.create({
    data: { name, categoryId }
  })
}

// application/usecases/CreateSpeciality.ts
export const createSpeciality = async (name: string, roleId: string) => {
  return prisma.speciality.create({
    data: { name, roleId }
  })
}

// application/usecases/CreateWorkType.ts
export const createWorkType = async (name: string, specialityId: string) => {
  return prisma.workType.create({
    data: { name, specialityId }
  })
}