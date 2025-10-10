import axios from 'axios';
import crypto from 'crypto';
import { ENV as env } from '../../config/env';
import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '../../config/prisma'
import { InitPaymentInput } from './chapa.validation';

const CHAPA_API_BASE = env.CHAPA_API_BASE;
const CHAPA_SECRET = env.CHAPA_SECRET;
const CHAPA_CALLBACK_URL = env.CHAPA_CALLBACK_URL;
const CHAPA_RETURN_URL = env.CHAPA_RETURN_URL;
const CHAPA_WEBHOOK_SECRET = env.CHAPA_WEBHOOK_SECRET;

if (!CHAPA_SECRET) throw new Error('Missing CHAPA_SECRET_KEY in env');



export async function chapaInitialize(payload: any) {
    const res = await axios.post(`${CHAPA_API_BASE}/transaction/initialize`, payload, {
        headers: {
            Authorization: `Bearer ${CHAPA_SECRET}`,
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    });
    return res.data;
}

export async function chapaVerify(txRef: string) {
    const res = await axios.get(`${CHAPA_API_BASE}/transaction/verify/${encodeURIComponent(txRef)}`, {
        headers: { Authorization: `Bearer ${CHAPA_SECRET}` },
        timeout: 10000,
    });
    return res.data;
}

export async function initializePayment(input: InitPaymentInput) {
    const tx_ref = input.txRef ?? `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;


    // Persist a ChapaTransaction record in DB (pending)
    const chapaTx = await prisma.chapaTransaction.create({
        data: {
            txRef: tx_ref,
            amount: new Prisma.Decimal(input.amount),
            currency: input.currency ?? 'ETB',
            status: 'PENDING',
            email: input.email ?? undefined,
            firstName: input.firstName ?? undefined,
            lastName: input.lastName ?? undefined,
            userId: input.userId ?? undefined,
            walletId: input.walletId ?? undefined,
            meta: {},
        },
    });


    const payload = {
        amount: String(input.amount),
        currency: input.currency ?? 'ETB',
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        tx_ref,
        callback_url: CHAPA_CALLBACK_URL,
        return_url: input.return_url ?? CHAPA_RETURN_URL,
    };


    const chapaResp = await chapaInitialize(payload);
    const checkoutUrl = chapaResp?.data?.checkout_url;


    if (!checkoutUrl) {
        // attach response to meta and mark as FAILED
        await prisma.chapaTransaction.update({
            where: { txRef: tx_ref },
            data: { status: 'FAILED', meta: chapaResp },
        });
        throw new Error('Chapa did not return a checkout_url');
    }


    // attach chapa response to meta for auditing
    await prisma.chapaTransaction.update({
        where: { txRef: tx_ref },
        data: { meta: chapaResp?.data ?? chapaResp },
    });


    return { checkoutUrl, txRef: tx_ref, chapaTx };
}

export async function reconcileTxByTxRef(txRef: string) {
    const verifyResp = await chapaVerify(txRef);
    const chapaData = verifyResp?.data ?? verifyResp;


    const status = (chapaData?.status ?? chapaData?.transactionStatus ?? 'FAILED').toUpperCase();


    const updateData: any = {
        chapaRef: chapaData?.ref_id ?? chapaData?.reference ?? undefined,
        status,
        meta: chapaData,
    };


    // try update existing record, otherwise create one
    const existing = await prisma.chapaTransaction.findUnique({ where: { txRef } });
    if (existing) {
        const updated = await prisma.chapaTransaction.update({ where: { txRef }, data: updateData });
        return { chapaData, chapaTransaction: updated };
    }


    // create a new record if not found
    const created = await prisma.chapaTransaction.create({
        data: {
            txRef,
            chapaRef: chapaData?.ref_id ?? chapaData?.reference,
            amount: new Prisma.Decimal(chapaData?.amount ?? 0),
            currency: chapaData?.currency ?? 'ETB',
            status,
            email: chapaData?.email ?? undefined,
            firstName: chapaData?.first_name ?? undefined,
            lastName: chapaData?.last_name ?? undefined,
            meta: chapaData,
        },
    });


    return { chapaData, chapaTransaction: created };
}

export function verifyWebhookSignature(rawBody: Buffer, headerSignature?: string | undefined) {
    if (!CHAPA_WEBHOOK_SECRET) {
        console.warn('No CHAPA_WEBHOOK_SECRET set - webhook signature cannot be verified');
        return false;
    }
    if (!headerSignature) return false;
    const computed = crypto.createHmac('sha256', CHAPA_WEBHOOK_SECRET).update(rawBody).digest('hex');
    return computed === headerSignature;
}

