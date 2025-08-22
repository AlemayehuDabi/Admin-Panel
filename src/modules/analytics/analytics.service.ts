import prisma from "../../config/prisma";
import { UserRole, JobStatus } from "@generated/prisma";

// Total users by role
export const getUserStats = async () => {
  const roles = Object.values(UserRole);
  const stats: Record<string, number> = {};

  for (const role of roles) {
    const count = await prisma.user.count({ where: { role } });
    stats[role] = count;
  }

  return stats;
};

// Jobs posted vs completed
export const getJobStats = async () => {
  const totalJobs = await prisma.job.count();
  const completedJobs = await prisma.job.count({ where: { status: JobStatus.COMPLETED } });
  const inProgressJobs = await prisma.job.count({ where: { status: JobStatus.IN_PROGRESS } });
  const openJobs = await prisma.job.count({ where: { status: JobStatus.OPEN } });

  return { totalJobs, completedJobs, inProgressJobs, openJobs };
};

// Wallet totals and transactions
export const getWalletStats = async () => {
  const wallets = await prisma.wallet.findMany({ include: { transactions: true } });
  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);

  const transactionCounts = {
    DEPOSIT: 0,
    WITHDRAWAL: 0,
    REFERRAL_REWARD: 0,
  };

  wallets.forEach((w) => {
    w.transactions.forEach((t) => {
      if (t.type in transactionCounts) {
        transactionCounts[t.type as keyof typeof transactionCounts] = (transactionCounts[t.type as keyof typeof transactionCounts] || 0) + 1;
      }
    });
  });

  return { totalBalance, transactionCounts };
};

// Referral program stats
export const getReferralStats = async () => {
  const users = await prisma.user.findMany({ where: { referredBy: { not: null } } });
  const referralCounts: Record<string, number> = {};

  users.forEach((u) => {
    if (u.referredBy) {
      referralCounts[u.referredBy] = (referralCounts[u.referredBy] || 0) + 1;
    }
  });

  return referralCounts;
};
