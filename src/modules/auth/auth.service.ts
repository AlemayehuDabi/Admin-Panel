// src/modules/auth/auth.service.ts
import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { UserStatus, VerificationStatus } from "@prisma/client";
import { sendResetEmail } from "../../utils/mailer";


function generateCode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-character hex code
}

export const register = async (data: any) => {
  const { fullName, phone, email, password, role, location } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } }) || await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw new Error("User already exists with this email or phone number");
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

export const workerLogin = async (data: any) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");
  const worker = await prisma.worker.findUnique({ where: { userId: user.id }, include: { user: true } });

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

  return { token, user, worker };
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

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: 404, message: "User not found" };
  const code = generateCode();
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  });
  await sendResetEmail(email, code);
  return `Reset code sent to ${email}`;
}

export const verifyResetCode = async (email: string, code: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: 404, message: "User not found" };

  const reset = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!reset) throw new Error("Invalid or expired code");

  // mark code as used
  await prisma.passwordReset.update({
    where: { id: reset.id },
    data: { used: true },
  });

  return "Code verified successfully" ;
};
