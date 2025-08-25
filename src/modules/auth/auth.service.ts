// src/modules/auth/auth.service.ts
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { UserStatus, VerificationStatus } from "@prisma/client/prisma";

export const register = async (data: any) => {
  const { fullName, phone, email, password, role, location } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      phone,
      email,
      passwordHash,
      role,
      location,
      status: UserStatus.PENDING,
      verification: VerificationStatus.PENDING,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    },
  });

  return user;
};

export const login = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  if (user.status === "INACTIVE") throw new Error("Account is deactivated");
  if (user.verification !== "APPROVED")
    throw new Error("Account not verified by admin");

  await prisma.user.update({
    where: { id: user.id },
    data: { tokenVersion: 0 },
  });

  // include tokenVersion in the token
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, tv: user.tokenVersion },
    ENV.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
};

export const approveUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      verification: VerificationStatus.APPROVED,
      status: UserStatus.ACTIVE,
    },
  });
};

export const rejectUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      verification: VerificationStatus.REJECTED,
      status: UserStatus.REJECTED,
    },
  });
};
