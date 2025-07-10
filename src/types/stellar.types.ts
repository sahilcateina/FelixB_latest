// src/types/stellar.types.ts
import { Horizon } from '@stellar/stellar-sdk';

export interface StellarResult {
    success: boolean;
    message: string;
   // result?: Horizon.SubmitTransactionResponse;
    error?: any;
    publicKey?: string;
    secretKey?: string;
    balance?: string;
    asset?: string;
    offers?: any[]; // Consider a more specific type for Horizon.OfferRecord
    account?: Horizon.AccountResponse; // For account details
}

export interface BludIssueRequest {
    destinationPublicKey: string;
    amount: string;
}

export interface BludPaymentRequest {
    sourceSecret?: string; // Optional if using signedXDR
    destinationPublicKey: string;
    amount: string;
    signedXDR?: string; // For client-side signed transactions
}

export interface BludOfferRequest {
    sourceSecret?: string; // Optional if using signedXDR
    amount: string; // amountBLUDToSell/Buy
    price: string; // pricePerBLUDInBuying/SellingAsset
    counterAssetCode?: string; // e.g., 'XLM', 'USD'
    counterAssetIssuer?: string; // Issuer for counterAsset if not XLM
    offerId?: string; // '0' for new, existing ID to update/delete
    signedXDR?: string; // For client-side signed transactions
}

export interface TrustlineRequest {
    accountSecret?: string; // Optional if using signedXDR
    limit?: string;
    signedXDR?: string; // For client-side signed transactions
}

export interface AccountBalanceRequest {
    publicKey: string;
    assetCode?: string;
    issuer?: string;
}
