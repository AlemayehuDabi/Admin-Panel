import type { Request, Response } from 'express';
import * as service from './chapa.service';

export async function initPaymentHandler(req: Request, res: Response) {
    try {
        const input = (req as any).validatedBody ?? req.body;
        const { checkoutUrl, txRef, chapaTx } = await service.initializePayment(input);
        return res.status(201).json({ checkoutUrl, txRef, chapaTx });
    } catch (err: any) {
        console.error('initPaymentHandler error', err?.response?.data ?? err.message ?? err);
        return res.status(500).json({ error: 'init_failed', details: err?.message ?? err });
    }
}

export async function callbackHandler(req: Request, res: Response) {
    try {
        // Chapa may call with query params like trx_ref, ref_id, status
        const { trx_ref, ref_id, status } = req.query as Record<string, string>;
        const txRef = trx_ref ?? (req.query as any).tx_ref ?? (req.query as any).txRef;
        if (!txRef) return res.status(400).send('missing tx_ref');


        const { chapaData, chapaTransaction } = await service.reconcileTxByTxRef(txRef);


        // redirect to frontend return URL with txRef and status
        const redirectTo = process.env.CHAPA_RETURN_URL ?? '/';
        return res.redirect(`${redirectTo}?txRef=${encodeURIComponent(txRef)}&status=${encodeURIComponent(chapaData?.status ?? status ?? '')}`);
    } catch (err: any) {
        console.error('callbackHandler error', err?.message ?? err);
        return res.status(500).send('callback_handling_error');
    }
}

export async function webhookHandler(req: Request, res: Response) {
    try {
        // raw body is attached by the route middleware
        const rawBody = (req as any).rawBody as Buffer | undefined;
        const headerSig = (req.headers['chapa-signature'] || req.headers['x-chapa-signature']) as string | undefined;
        if (!rawBody) return res.status(400).send('missing raw body');


        const ok = service.verifyWebhookSignature(rawBody, headerSig);
        if (!ok) {
            console.warn('webhook signature mismatch');
            return res.status(401).send('Unauthorized');
        }


        const event = JSON.parse(rawBody.toString('utf8'));
        const txRef = event?.tx_ref ?? event?.transaction?.tx_ref ?? event?.reference ?? event?.txRef;


        if (!txRef) {
            console.warn('webhook: no txRef in payload', event);
            // still acknowledge to avoid retries
            return res.status(200).send('no_txref');
        }


        // reconcile using Chapa verify (stronger) or event payload
        await service.reconcileTxByTxRef(txRef);


        return res.status(200).send('ok');
    } catch (err) {
        console.error('webhookHandler error', err);
        // respond 200 or 500 depending on whether you want Chapa to retry
        return res.status(500).send('error');
    }
}

