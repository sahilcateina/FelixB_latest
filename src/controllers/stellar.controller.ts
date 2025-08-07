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
    const { sellerSecret, serviceName, description, bludAmount, assetCode, issuerPublicKey } = req.body;

    const result = await stellarService.sellService({ 
      sellerSecret, 
      serviceName, 
      description, 
      bludAmount,
      assetCode,
      issuerPublicKey
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
    const { buyerSecret, serviceId, assetCode, issuerPublicKey } = req.body;

    const result = await stellarService.buyService({ 
      buyerSecret, 
      serviceId,
      assetCode,
      issuerPublicKey
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


export const getAllAssets = async (_req: Request, res: Response) => {
  try {
    const assets = await stellarService.getAllAssets();
    res.status(200).json({
      success: true,
      message: 'Fetched all created assets',
      result: assets
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets',
      error: error.message
    });
  }
};



export const getBalancesFromIssuer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { issuerSecret, assetCode } = req.body;

    if (!issuerSecret || !assetCode) {
      res.status(400).json({ success: false, message: 'issuerSecret and assetCode are required' });
      return;
    }

    const result = await stellarService.getBalancesFromIssuer(issuerSecret, assetCode);
    res.status(200).json({ success: true, message: 'Balances fetched', result });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch balances from issuer',
      error: error.message,
    });
  }
};

export const sayHello = () => {
  return "Hello from PR Agent!";
};

function userAuth(data) {
  if (data.username == "admin" && data.password == "123456") {
    console.log("Access granted");
  } else {
    console.log("Access denied");
  }
}

// Testing trigger
