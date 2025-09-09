import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';


export type CreatePlanDto = {
    name: string;
    description?: string;
    price: number;
    interval: "MONTHLY" | "YEARLY";
    features?: string[];
    status?: "ACTIVE" | "INACTIVE";
};

export const createPlan = async (data: CreatePlanDto) => {
    const exists = await prisma.plan.findFirst({ where: { name: data.name } })
    if (exists) throw new Error('Plan with this name already exists')
    return prisma.plan.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            interval: data.interval,
            features: data.features ?? [],
            status: data.status ?? "ACTIVE",
        },
    });
};

export const getPlans = async (take = 20, skip = 0) => {
    return prisma.plan.findMany({
        take,
        skip,
        orderBy: { createdAt: "desc" },
    });
};

export const getPlanById = async (id: string) => {
    return prisma.plan.findUnique({ where: { id } });
};

export const updatePlan = async (id: string, data: Partial<CreatePlanDto>) => {
    return prisma.plan.update({
        where: { id },
        data: {
            ...data,
            features: data.features,
        },
    });
};

export const deletePlan = async (id: string) => {
    return prisma.plan.delete({ where: { id } });
};