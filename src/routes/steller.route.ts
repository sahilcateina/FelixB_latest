// src/routes/stellar.route.ts
import express from 'express';
import { createStellarAccount, sendLumens } from '../controllers/steller.controller';

const router = express.Router();

router.post('/account/create', createStellarAccount);
router.post('/transaction/send', sendLumens);

export default router;
