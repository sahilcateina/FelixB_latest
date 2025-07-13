// src/routes/stellar.route.ts
import express from 'express';
import * as stellarController from '../controllers/stellar.controller';

const router = express.Router();

router.post('/account/create', stellarController.createStellarAccount);
router.post('/transaction/send', stellarController.sendLumens);
router.post('/currency/create', stellarController.handleCreateCurrency);
router.post('/trustline/change', stellarController.handleChangeTrustline);
router.post('/service/sell', stellarController.sellService);
router.post('/service/buy', stellarController.buyService);

router.get('/account/balance/:publicKey', stellarController.getAccountBalance);
router.get('/service', stellarController.getAvailableServices);




export default router;










// // src/routes/stellar.routes.ts
// import { Router } from 'express';
// import * as stellarController from '../controllers/stellar.controller';

// const router = Router();

// // Account management
// router.post('/create-account', stellarController.createAccount);
// router.post('/trustline', stellarController.establishTrustline);

// // BLUD operations
// router.post('/issue-blud', stellarController.issueBlud);
// router.post('/send-blud', stellarController.sendBlud);

// // DEX operations
// router.post('/offers/sell-blud', stellarController.createBludSellOffer);
// router.post('/offers/buy-blud', stellarController.createBludBuyOffer);

// // Generic transaction submission (for client-signed XDRs)
// router.post('/submit-xdr', stellarController.submitSignedXDR);

// // Data retrieval
// router.get('/balance/:publicKey', stellarController.getBalance);
// router.get('/offers/:publicKey', stellarController.getOffers);
// router.get('/account-details/:publicKey', stellarController.getAccountDetails);


// export default router;