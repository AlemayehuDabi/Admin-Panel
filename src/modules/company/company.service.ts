import prisma from "../../config/prisma";
import { VerificationStatus, UserStatus } from "@prisma/client";
import { Company } from "@prisma/client";
import bcrypt from "bcrypt";

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

// Register a company
export const registerCompany = async (data: any) => {
  const { fullName, phone, email, password, location, companyLogo, businessLocation, verificationDocuments } = data;
  
  const existingUser = await prisma.user.findUnique({ where: { email } }) || await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw new Error("User already exists with this email or phone number");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const company = await prisma.user.create({
    data: {
      fullName,
      phone,
      email,
      passwordHash,
      role: "COMPANY",
      location,
      status: UserStatus.PENDING,
      verification: VerificationStatus.PENDING,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),

      companyProfile: {
        create: {
          companyLogo,
          businessLocation,
          verificationDocuments
        },
      },
    },
    include: {
      companyProfile: true,
    },
  });
  return company;
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

