import prisma  from "../../config/prisma";
import { Prisma } from "@prisma/client";

export type CreateBankDto = {
  name: string;
  accountName: string;
  accountNo: string;
  type: "BANK" | "WALLET";
  status?: "ACTIVE" | "INACTIVE";
};

export const createBank = async (data: CreateBankDto) =>{
  const exists = await prisma.bank.findFirst({where:{accountNo:data.accountNo}})
  if(exists) throw new Error('Bank with this account number already exists')
  return prisma.bank.create({ data });
}

export const listBanks = async (take = 50, skip = 0) =>
  prisma.bank.findMany({ take, skip, orderBy: { createdAt: "desc" } });

export const getBank = async (id: string) =>
  prisma.bank.findUnique({ where: { id } });

export const updateBank = async (id: string, data: Partial<CreateBankDto>) =>
  prisma.bank.update({ where: { id }, data });

export const deleteBank = async (id: string) =>
  prisma.bank.delete({ where: { id } });
