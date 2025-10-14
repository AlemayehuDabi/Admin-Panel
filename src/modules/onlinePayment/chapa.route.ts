import express from 'express';
import bodyParser from 'body-parser';
import validate from './../../middlewares/validate';
import { initPaymentHandler, callbackHandler, webhookHandler } from './chapa.controller';
import { initPaymentSchema } from './chapa.validation';

const router = express.Router();

// POST /api/online-payments/init
router.post('/init', express.json(), validate(initPaymentSchema, "body"), initPaymentHandler);


// GET /api/online-payments/callback
router.get('/callback', callbackHandler);


// POST /api/online-payments/webhook
// this route MUST receive raw body to verify HMAC signature
router.post(
    '/webhook',
    bodyParser.raw({ type: 'application/json' }),
    (req, res, next) => {
        // expose raw body buffer for controller/service
        (req as any).rawBody = req.body;
        // also parse and attach the JSON for convenience
        try { req.body = JSON.parse(req.body.toString('utf8')); } catch (e) { req.body = {}; }
        next();
    },
    webhookHandler,
);


export default router;