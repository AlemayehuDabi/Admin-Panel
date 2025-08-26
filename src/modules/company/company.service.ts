import prisma from "../../config/prisma";
import { VerificationStatus, UserStatus } from "@prisma/client";
import { Company } from "../../generated/prisma";

// Get all companies (optional filters)
export const getAllCompanies = async (filters?: {
  verification?: VerificationStatus;
  status?: UserStatus;
}) => {
  return prisma.company.findMany({
    where: {
      user: {
        verification: filters?.verification,
        status: filters?.status,
      },
    },
    include: {
      user: true,
      jobs: true,
    },
  });
};

// Get company details by ID
export const getCompanyById = async (companyId: string) => {
  return prisma.user.findUnique({
    where: { id: companyId },
    include: {
      companyProfile: true,
    },
  });
};

// Approve a company
export const approveCompany = async (companyId: string) => {
  const company = await prisma.user.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  return prisma.user.update({
    where: { id: companyId },
    data: {
      verification: VerificationStatus.APPROVED,
      status: UserStatus.ACTIVE,
    },
  });
};

// Reject a company
export const rejectCompany = async (companyId: string) => {
  const company = await prisma.user.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  return prisma.user.update({
    where: { id: companyId },
    data: {
      verification: VerificationStatus.REJECTED,
      status: UserStatus.REJECTED,
    },
  });
};

// Update company detail
export const updateDetail = async (companyId: string, data: Partial<Company>) => {
  const user = await prisma.user.findUnique({ where: { id: companyId } });
  if (!user) throw new Error("Company not found");
  if (user.role !== "COMPANY") throw new Error("User is not a company");
  return prisma.company.upsert({
    where: { userId: companyId },  // ✅ match on unique userId
    create: {
      userId: companyId,
      ...data,
    },
    update: data,
  });
};

