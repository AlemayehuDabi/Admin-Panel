import prisma from "../../config/prisma";
import { VerificationStatus, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";

// Get all workers (optionally filter by verification or status)
interface WorkerFilter {
  categoryId?: string;
  roleId?: string;
  specialtyId?: string;
  workTypeId?: string;
  title?: string;
  jobLocation?: string;
  payRate?: number;
  jobType?: string;
  startDate?: Date;
  requiredSkills?: string[];
}

export const filterWorkers = async (filters: WorkerFilter) => {
  return prisma.worker.findMany({
    where: {
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.roleId && { roleId: filters.roleId }),
      ...(filters.specialtyId && {
        specialties: { some: { specialtyId: filters.specialtyId } },
      }),
      ...(filters.workTypeId && {
        workTypes: { some: { workTypeId: filters.workTypeId } },
      }),
      ...(filters.title && { title: { contains: filters.title, mode: "insensitive" } }),
      ...(filters.jobLocation && {
        jobLocation: { contains: filters.jobLocation, mode: "insensitive" },
      }),
      ...(filters.payRate && { payRate: { gte: filters.payRate } }),
      ...(filters.jobType && { jobType: filters.jobType }),
      ...(filters.startDate && { startDate: { gte: filters.startDate } }),
      ...(filters.requiredSkills && filters.requiredSkills.length > 0 && {
        requiredSkills: {
          hasSome: filters.requiredSkills, // assuming it's a string[] column
        },
      }),
    },
    include: {
      category: true,
      Role: true,
      specialities: { include: { speciality: true } },
      workTypes: { include: { workType: true } },
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

export const workerRegister = async (data: any) => {
  const workerExist = await prisma.user.findUnique({
    where: { email: data.email},
  });
  if (workerExist) throw new Error("Email already taken");

  const phoneExist = await prisma.user.findUnique({
    where: { phone: data.phone },
  });
  if (phoneExist) throw new Error("Phone number already taken");

  const { fullName, email, phone, password, role, location, skills, portfolio, availability, experience, categoryId, roleId, specialityIds, workTypeIds } = data;
  const passwordHash = await bcrypt.hash(password, 10);
  const newWorkerUser = await prisma.user.create({
  data: {
    fullName,
    email,
    phone,
    passwordHash,
    role,
    location,
    status: "PENDING",
    verification: "PENDING",
    referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),

    workerProfile: {
      create: {
        categoryId: categoryId, 
        Role: roleId,
        professionalRole: "Pipe Fitter",
        skills,
        portfolio,
        availability,
        experience,

        // Specialities (many-to-many through WorkerSpeciality)
        specialities: {
          create: (specialityIds || []).map((specialityId: string) => ({
            speciality: { connect: { id: specialityId } },
          })),
        },

        // Work Types (many-to-many through WorkerWorkType)
        workTypes: {
          create: (workTypeIds || []).map((workTypeId: string) => ({
            workType: { connect: { id: workTypeId } },
          })),
        },
      },
    },
  },
  include: {
    workerProfile: {
      include: {
        specialities: { include: { speciality: true } },
        workTypes: { include: { workType: true } },
      },
    },
  },
});

return newWorkerUser;

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

export const createCategory = async (name: string, description: string) => {
  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) throw new Error("Category already exists");

  return prisma.category.create({
    data: { name, description }
  })
}

export const createRole = async (name: string, description: string, categoryId: string) => {
  const exists = await prisma.role.findUnique({ where: { name } });
  if (exists) throw new Error("Role already exists");

  return prisma.role.create({
    data: { name, description, categoryId }
  })
}

export const createSpeciality = async (name: string, description: string, roleId: string) => {
  const exists = await prisma.speciality.findUnique({ where: { name } });
  if (exists) throw new Error("Speciality already exists");

  return prisma.speciality.create({
    data: { name, description, roleId }
  })
}

export const createWorkType = async (name: string, description: string, specialityId: string) => {
  return prisma.workType.create({
    data: { name, description, specialityId }
  })
}