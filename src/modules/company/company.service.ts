import prisma from "../../config/prisma";
import { VerificationStatus, UserStatus } from "@prisma/client/prisma";

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
  return prisma.company.findUnique({
    where: { id: companyId },
    include: {
      user: true,
      jobs: true,
    },
  });
};

// Approve a company
export const approveCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  return prisma.user.update({
    where: { id: company.userId },
    data: {
      verification: VerificationStatus.APPROVED,
      status: UserStatus.ACTIVE,
    },
  });
};

// Reject a company
export const rejectCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) throw new Error("Company not found");

  return prisma.user.update({
    where: { id: company.userId },
    data: {
      verification: VerificationStatus.REJECTED,
      status: UserStatus.REJECTED,
    },
  });
};
