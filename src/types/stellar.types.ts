// src/types/stellar.types.ts
import { Horizon } from '@stellar/stellar-sdk';

export interface StellarResult {
    success: boolean;
    message: string;
    result?: Horizon.SubmitTransactionResponse; // ✅ Add this line
    error?: any;
    publicKey?: string;
    secretKey?: string;
    balance?: string;
    asset?: string;
    offers?: any[];
    account?: Horizon.AccountResponse;
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


export interface SellServiceRequest {
    sellerSecret: string;
    serviceName: string;
    description: string;
    bludAmount: string;
  }
  
  export interface BuyServiceRequest {
    buyerSecret: string;
    serviceId: string;
  }


  export interface Service {
    id?: string;
    seller_public_key: string;
    name: string;
    description: string;
    blud_price: string;
    status: 'available' | 'sold' | 'cancelled';
    created_at?: string;
  }


  export interface ServiceTransaction {
    id?: string;
    service_id: string;
    buyer_public_key: string;
    seller_public_key: string;
    blud_amount: string;
    transaction_hash: string;
    created_at?: string;
  }




export interface CreateCurrencyRequest {
    issuerSecret: string;
    distributorPublicKey: string;
    assetCode: string;
    amount: string;
  }
  
  export interface ChangeTrustlineRequest {
    accountSecret: string;
    assetCode: string;
    issuerPublicKey: string;
    limit?: string;
  }
  

  export interface OfferRequest {
    sourceSecret: string;
    amount: string;
    price: string; // Price per BLUD in XLM (example: "1.5")
    offerId?: string; // "0" for new offer, or existing offer ID to update
  }