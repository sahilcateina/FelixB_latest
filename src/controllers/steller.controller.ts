// src/controllers/stellar.controller.ts
import { Request, Response } from 'express';
import * as stellarService from '../services/steller.service';

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
