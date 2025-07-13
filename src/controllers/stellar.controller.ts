// src/controllers/stellar.controller.ts
import { Request, Response } from 'express';
import * as stellarService from '../services/stellar.service';

export const createStellarAccount = async (req: Request, res: Response) => {
  try {
    const result = await stellarService.createAccount();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const sendLumens = async (req: Request, res: Response) => {
  try {
    const { sourceSecret, destinationPublic, amount } = req.body;
    const result = await stellarService.sendXLM(sourceSecret, destinationPublic, amount);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



// export const handleCreateCurrency = async (req: Request, res: Response) => {
//   try {
//     const result = await stellarService.createCurrency(req.body);
//     res.status(result.success ? 200 : 500).json(result);
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Currency creation failed',
//       error: error.message,
//     });
//   }
// };

export const handleCreateAssetOnly = async (req: Request, res: Response) => {
  try {
    const result = await stellarService.createAssetOnly(req.body);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Asset creation failed',
      error: error.message,
    });
  }
};

export const handleSendAsset = async (req: Request, res: Response) => {
  try {
    const result = await stellarService.sendAsset(req.body);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Asset sending failed',
      error: error.message,
    });
  }
};



export const handleChangeTrustline = async (req: Request, res: Response) => {
  try {
    const result = await stellarService.changeTrustline(req.body);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Trustline setup failed',
      error: error.message,
    });
  }
};


export const sellService = async (req: Request, res: Response) => {
  try {
    const { sellerSecret, serviceName, description, bludAmount } = req.body;
    const result = await stellarService.sellService({ 
      sellerSecret, 
      serviceName, 
      description, 
      bludAmount 
    });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to list service for sale',
      error: error.message 
    });
  }
};

export const buyService = async (req: Request, res: Response) => {
  try {
    const { buyerSecret, serviceId } = req.body;
    const result = await stellarService.buyService({ 
      buyerSecret, 
      serviceId 
    });
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to purchase service',
      error: error.message 
    });
  }
};


export const getAccountBalance = async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params;
    const result = await stellarService.getAccountBalance(publicKey);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch account balance',
      error: error.message,
    });
  }
};

export const getAvailableServices = async (req: Request, res: Response) => {
  try {
    const result = await stellarService.getAvailableServices();
    res.status(200).json({
      success: true,
      message: 'Available services fetched successfully',
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available services',
      error: error.message
    });
  }
};









// // src/controllers/stellar.controller.ts
// import { Request, Response } from 'express';
// import * as stellarService from '../services/stellar.service';
// import { BLUD_ASSET } from '../dao/stellar.dao'; // Import BLUD_ASSET for validation/context
// import { Asset } from '@stellar/stellar-sdk';
// import {
//     BludIssueRequest,
//     BludPaymentRequest,
//     BludOfferRequest,
//     TrustlineRequest,
//     AccountBalanceRequest,
// } from '../types/stellar.types';

// // --- IMPORTANT: Securely manage secret keys. These are for backend-controlled operations. ---
// // In a real app, load from environment variables or a KMS.
// // NEVER hardcode or commit these.
// const CEO_SECRET_KEY = 'SA...'; // Raj's secret key (or the org's primary signing key)
// const BLUD_ISSUER_SECRET_KEY = 'SA...'; // The secret key for the BLUD issuer account. MUST match BLUD_ASSET.issuer
// const DEMO_MANAGER_SECRET_KEY = 'SA...'; // Placeholder for a manager's key (e.g., Ashwini's) for multi-sig demos


// export const createAccount = async (req: Request, res: Response) => {
//     const result = await stellarService.createAccountAndFund();
//     if (result.success) {
//         // IMPORTANT: In a real app, result.secretKey should be securely
//         // delivered to the user ONCE and NOT stored on the backend.
//         res.status(201).json(result);
//     } else {
//         res.status(500).json(result);
//     }
// };

// export const establishTrustline = async (req: Request<{}, {}, TrustlineRequest>, res: Response) => {
//     const { accountSecret, signedXDR } = req.body;

//     if (!accountSecret && !signedXDR) {
//         return res.status(400).json({ success: false, message: 'Account secret or signed XDR is required.' });
//     }

//     let result;
//     if (signedXDR) {
//         // Use case: User signed trustline creation client-side
//         result = await stellarService.submitSignedTransactionXDR(signedXDR);
//     } else if (accountSecret) {
//         // Use case: Backend manages key (e.g., creating trustline for a new Desk/Team wallet)
//         result = await stellarService.establishBLUDTrustline(accountSecret, req.body.limit);
//     }

//     if (result && result.success) {
//         res.json(result);
//     } else {
//         res.status(500).json(result || { success: false, message: 'Invalid request' });
//     }
// };

// export const issueBlud = async (req: Request<{}, {}, BludIssueRequest>, res: Response) => {
//     const { destinationPublicKey, amount } = req.body;

//     // TODO: Add Keycloak authorization here. Only CEO_ROLE can issue BLUD.
//     // if (!req.user || !req.user.roles.includes('CEO_ROLE')) { ... }

//     const result = await stellarService.issueBLUD(BLUD_ISSUER_SECRET_KEY, destinationPublicKey, amount);
//     if (result.success) {
//         res.json(result);
//     } else {
//         res.status(500).json(result);
//     }
// };

// export const sendBlud = async (req: Request<{}, {}, BludPaymentRequest>, res: Response) => {
//     const { sourceSecret, destinationPublicKey, amount, signedXDR } = req.body;

//     if (!destinationPublicKey || !amount) {
//         return res.status(400).json({ success: false, message: 'Destination public key and amount are required.' });
//     }
//     if (!sourceSecret && !signedXDR) {
//         return res.status(400).json({ success: false, message: 'Source secret or signed XDR is required.' });
//     }

//     let result;
//     if (signedXDR) {
//         // TODO: Add Keycloak authorization: Verify signedXDR is from the authenticated user's wallet
//         result = await stellarService.submitSignedTransactionXDR(signedXDR);
//     } else if (sourceSecret) {
//         // TODO: Add Keycloak authorization: Verify authenticated user has permission to use sourceSecret
//         // This path is typically for backend-managed keys (e.g., shared wallets) or demos.
//         result = await stellarService.sendBLUDPayment(sourceSecret, destinationPublicKey, amount);
//     }

//     if (result && result.success) {
//         res.json(result);
//     } else {
//         res.status(500).json(result || { success: false, message: 'Invalid request' });
//     }
// };

// export const createBludSellOffer = async (req: Request<{}, {}, BludOfferRequest>, res: Response) => {
//     const { sourceSecret, amount, price, counterAssetCode, counterAssetIssuer, offerId, signedXDR } = req.body;

//     if (!amount || !price) {
//         return res.status(400).json({ success: false, message: 'Amount and price are required.' });
//     }
//     if (!sourceSecret && !signedXDR) {
//         return res.status(400).json({ success: false, message: 'Source secret or signed XDR is required.' });
//     }

//     let buyingAsset: Asset = Asset.native(); // Default to XLM
//     if (counterAssetCode && counterAssetCode.toUpperCase() !== 'XLM' && counterAssetIssuer) {
//         buyingAsset = new Asset(counterAssetCode, counterAssetIssuer);
//     }

//     let result;
//     if (signedXDR) {
//         // TODO: Add Keycloak authorization here
//         result = await stellarService.submitSignedTransactionXDR(signedXDR);
//     } else if (sourceSecret) {
//         // TODO: Add Keycloak authorization here
//         result = await stellarService.createBLUDSellOffer(sourceSecret, amount, price, buyingAsset, offerId);
//     }

//     if (result && result.success) {
//         res.json(result);
//     } else {
//         res.status(500).json(result || { success: false, message: 'Invalid request' });
//     }
// };

// export const createBludBuyOffer = async (req: Request<{}, {}, BludOfferRequest>, res: Response) => {
//     const { sourceSecret, amount, price, counterAssetCode, counterAssetIssuer, offerId, signedXDR } = req.body;

//     if (!amount || !price) {
//         return res.status(400).json({ success: false, message: 'Amount and price are required.' });
//     }
//     if (!sourceSecret && !signedXDR) {
//         return res.status(400).json({ success: false, message: 'Source secret or signed XDR is required.' });
//     }

//     let sellingAsset: Asset = Asset.native(); // Default to XLM
//     if (counterAssetCode && counterAssetCode.toUpperCase() !== 'XLM' && counterAssetIssuer) {
//         sellingAsset = new Asset(counterAssetCode, counterAssetIssuer);
//     }

//     let result;
//     if (signedXDR) {
//         // TODO: Add Keycloak authorization here
//         result = await stellarService.submitSignedTransactionXDR(signedXDR);
//     } else if (sourceSecret) {
//         // TODO: Add Keycloak authorization here
//         result = await stellarService.createBLUDBuyOffer(sourceSecret, amount, price, sellingAsset, offerId);
//     }

//     if (result && result.success) {
//         res.json(result);
//     } else {
//         res.status(500).json(result || { success: false, message: 'Invalid request' });
//     }
// };

// export const submitSignedXDR = async (req: Request<{}, {}, { signedXDR: string }>, res: Response) => {
//     const { signedXDR } = req.body;
//     if (!signedXDR) {
//         return res.status(400).json({ success: false, message: 'Signed XDR is required.' });
//     }

//     // TODO: Authorization: Verify signedXDR belongs to the authenticated user or an authorized multi-sig wallet.
//     const result = await stellarService.submitSignedTransactionXDR(signedXDR);
//     if (result.success) {
//         res.json(result);
//     } else {
//         res.status(500).json(result);
//     }
// };

// export const getBalance = async (req: Request, res: Response) => {
//     const { publicKey } = req.params;
//     const { assetCode, issuer } = req.query as unknown as Partial<AccountBalanceRequest>; // Cast to Partial for optional query params

//     if (!publicKey) {
//         return res.status(400).json({ success: false, message: 'Public key is required.' });
//     }

//     const result = await stellarService.getAccountBalance(publicKey, assetCode, issuer);
//     if (result.success) {
//         res.json(result);
//     } else if (result.message.includes('not found')) {
//         res.status(404).json(result);
//     } else {
//         res.status(500).json(result);
//     }
// };

// export const getOffers = async (req: Request, res: Response) => {
//     const { publicKey } = req.params;
//     if (!publicKey) {
//         return res.status(400).json({ success: false, message: 'Public key is required.' });
//     }

//     const result = await stellarService.getAccountOffers(publicKey);
//     if (result.success) {
//         res.json(result);
//     } else if (result.message.includes('not found')) {
//         res.status(404).json(result);
//     } else {
//         res.status(500).json(result);
//     }
// };

// export const getAccountDetails = async (req: Request, res: Response) => {
//     const { publicKey } = req.params;
//     if (!publicKey) {
//         return res.status(400).json({ success: false, message: 'Public key is required.' });
//     }

//     const result = await stellarService.getAccountDetails(publicKey);
//     if (result.success) {
//         res.json(result);
//     } else if (result.message.includes('not found')) {
//         res.status(404).json(result);
//     } else {
//         res.status(500).json(result);
//     }
// };

