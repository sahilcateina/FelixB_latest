// src/services/stellar.service.ts
import { Horizon, Keypair, Networks, TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';
import * as StellarSdk from '@stellar/stellar-sdk';
import Server from "@stellar/stellar-sdk";
import { Transaction } from '@stellar/stellar-sdk';
import * as stellarDao from '../dao/stellar.dao';
import * as StellarTypes from '../types/stellar.types';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

// import dotenv from 'dotenv';
// dotenv.config();

// export const BLUD_ASSET = new Asset('BLUD', 'GAHPJJR5VZNEU3PXUUNI7HAG4D7USDBPJCZRLZDFIBMPWEMRWR7D3O2D');
// export const BLUD_ASSET = new Asset('BLUD', process.env.ISSUER_PUBLIC_KEY);


export const createAccount = async () => {
  const pair = Keypair.random();

  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
  );

  if (!response.ok) {
    throw new Error('Failed to fund account with Friendbot.');
  }

  await stellarDao.saveStellarAccount(pair.publicKey(), pair.secret());

  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret(),
    message: 'Testnet Stellar account created and funded.',
  };
};


export const sendXLM = async (
  sourceSecret: string,
  destinationPublic: string,
  amount: string
) => {
  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublic,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);

  const result = await server.submitTransaction(transaction);

  return {
    success: true,
    message: 'Transaction successful',
    result,
  };
};



// export const createAssetOnly = async ({
//   issuerSecret,
//   assetCode,
// }: {
//   issuerSecret: string;
//   assetCode: string;
// }): Promise<StellarTypes.StellarResult> => {
//   try {
//     const issuerKeypair = Keypair.fromSecret(issuerSecret);
//     const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
//     const customAsset = new Asset(assetCode, issuerKeypair.publicKey());

//     // Dummy transaction to "register" asset (optional in real Stellar, for bookkeeping)
//     return {
//       success: true,
//       message: `Asset ${assetCode} is now defined under issuer ${issuerKeypair.publicKey()}`,
//       result: {
//         asset_code: assetCode,
//         issuer: issuerKeypair.publicKey()
//       }
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: 'Failed to define asset',
//       error: error.message,
//     };11                                                                                                     
//   }
// };

export const createAssetOnly = async ({
  issuerSecret,
  assetCode,
}: {
  issuerSecret: string;
  assetCode: string;
}): Promise<StellarTypes.StellarResult> => {
  try {
    const issuerKeypair = Keypair.fromSecret(issuerSecret);
    const issuerPublicKey = issuerKeypair.publicKey();
    const issuerAccount = await server.loadAccount(issuerPublicKey);
    const customAsset = new Asset(assetCode, issuerPublicKey);

    // Save asset to Supabase
    const assetRecord = await stellarDao.saveAsset({
      asset_code: assetCode,
      issuer_public_key: issuerPublicKey
    });

    return {
      success: true,
      message: `Asset ${assetCode} created and stored successfully`,
      result: assetRecord
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to define asset',
      error: error.message,
    };
  }
};

export const sendAsset = async ({
  issuerSecret,
  receiverPublicKey,
  assetCode,
  amount,
}: {
  issuerSecret: string;
  receiverPublicKey: string;
  assetCode: string;
  amount: string;
}): Promise<StellarTypes.StellarResult> => {
  try {
    const issuerKeypair = Keypair.fromSecret(issuerSecret);
    const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
    const customAsset = new Asset(assetCode, issuerKeypair.publicKey());

    const transaction = new TransactionBuilder(issuerAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({
        destination: receiverPublicKey,
        asset: customAsset,
        amount,
      }))
      .setTimeout(30)
      .build();

    transaction.sign(issuerKeypair);
    const result = await server.submitTransaction(transaction);

    return {
      success: true,
      message: `Sent ${amount} ${assetCode} to ${receiverPublicKey}`,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to send asset',
      error: error.message,
    };
  }
};



export const changeTrustline = async ({
  accountSecret,
  assetCode,
  issuerPublicKey,
  limit = '100000',
}: StellarTypes.ChangeTrustlineRequest): Promise<StellarTypes.StellarResult> => {

  try {
    const keypair = Keypair.fromSecret(accountSecret);
    const account = await server.loadAccount(keypair.publicKey());
    const customAsset = new Asset(assetCode, issuerPublicKey);

    const transaction = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset: customAsset, limit }))
      .setTimeout(30)
      .build();

    transaction.sign(keypair);
    const result = await server.submitTransaction(transaction);

    return {
      success: true,
      message: `Trustline established for ${assetCode}`,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to establish trustline for ${assetCode}`,
      error: error.message,
    };
  }
};


export const sellService = async ({
  sellerSecret,
  serviceName,
  description,
  bludAmount,
  assetCode,
  issuerPublicKey
}: StellarTypes.SellServiceRequest): Promise<StellarTypes.StellarResult> => {
  try {
    const sellerKeypair = Keypair.fromSecret(sellerSecret);
    const sellerAccount = await server.loadAccount(sellerKeypair.publicKey());

    const asset = new Asset(assetCode, issuerPublicKey);

    const bludBalance = sellerAccount.balances.find(
      b =>
        'asset_code' in b &&
        b.asset_code === asset.getCode() &&
        'asset_issuer' in b &&
        b.asset_issuer === asset.getIssuer()
    );

    if (!bludBalance || parseFloat((bludBalance as any).balance) < parseFloat(bludAmount)) {
      return {
        success: false,
        message: 'Insufficient BLUD balance to list service'
      };
    }

    const service = await stellarDao.createService({
      seller_public_key: sellerKeypair.publicKey(),
      name: serviceName,
      description,
      blud_price: bludAmount,
      status: 'available'
    });

    return {
      success: true,
      message: 'Service listed for sale successfully',
      result: service
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to list service',
      error: error.message
    };
  }
};



export const buyService = async ({
  buyerSecret,
  serviceId,
  assetCode,
  issuerPublicKey
}: StellarTypes.BuyServiceRequest): Promise<StellarTypes.StellarResult> => {
  try {
    const service = await stellarDao.getService(serviceId);
    if (!service || service.status !== 'available') {
      return {
        success: false,
        message: 'Service not available for purchase'
      };
    }

    const buyerKeypair = Keypair.fromSecret(buyerSecret);
    const buyerAccount = await server.loadAccount(buyerKeypair.publicKey());

    const bludAsset = new Asset(assetCode, issuerPublicKey);

    console.log('Buyer Balances:', buyerAccount.balances);

    const hasTrustline = buyerAccount.balances.some(
      b =>
        'asset_code' in b &&
        b.asset_code === bludAsset.code &&
        'asset_issuer' in b &&
        b.asset_issuer === bludAsset.issuer
    );

    if (!hasTrustline) {
      return {
        success: false,
        message: 'Buyer needs to establish a trustline for BLUD first'
      };
    }

    const buyerBalance = buyerAccount.balances.find(
      b =>
        'asset_code' in b &&
        b.asset_code === bludAsset.code &&
        'asset_issuer' in b &&
        b.asset_issuer === bludAsset.issuer
    );

    if (!buyerBalance || parseFloat((buyerBalance as any).balance) < parseFloat(service.blud_price)) {
      return {
        success: false,
        message: 'Insufficient BLUD balance to complete purchase'
      };
    }

    const transaction = new TransactionBuilder(buyerAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({
        destination: service.seller_public_key,
        asset: bludAsset,
        amount: service.blud_price,
      }))
      .setTimeout(30)
      .build();

    transaction.sign(buyerKeypair);
    const paymentResult = await server.submitTransaction(transaction);

    await stellarDao.updateService(serviceId, { status: 'sold' });

    const serviceTransaction = await stellarDao.createServiceTransaction({
      service_id: serviceId,
      buyer_public_key: buyerKeypair.publicKey(),
      seller_public_key: service.seller_public_key,
      blud_amount: service.blud_price,
      transaction_hash: paymentResult.hash
    });

    return {
      success: true,
      message: 'Service purchased successfully',
      result: {
        payment: paymentResult,
        transactionRecord: serviceTransaction
      }
    };
  } catch (error: any) {
    console.error('Buy Service Error:', error?.response?.data || error.message || error);
    return {
      success: false,
      message: 'Failed to purchase service',
      error: error?.response?.data || error.message
    };
  }
};






export const getAccountBalance = async (publicKey: string): Promise<StellarTypes.StellarResult> => {
  try {
    const account = await server.loadAccount(publicKey);

    const balances = account.balances.map(b => ({
      asset_type: b.asset_type,
      asset_code: 'asset_code' in b ? b.asset_code : 'XLM',
      asset_issuer: 'asset_issuer' in b ? b.asset_issuer : 'native',
      balance: b.balance
    }));

    return {
      success: true,
      message: 'Account balances fetched successfully',
      result: balances,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch account balance',
      error: error.message,
    };
  }
};



export const getAvailableServices = async () => {
  return await stellarDao.getAvailableServices();
};


export const getAllAssets = async () => {
  return await stellarDao.getAllAssets();
};


export const getBalancesFromIssuer = async (
  issuerSecret: string,
  assetCode: string
) => {
  const issuerKeypair = Keypair.fromSecret(issuerSecret);
  const issuerPublicKey = issuerKeypair.publicKey();
  const recipients = new Set<string>();

  const payments = await server
    .payments()
    .forAccount(issuerPublicKey)
    .order('desc')
    .limit(200)
    .call();

  payments.records.forEach((op: any) => {
    if (
      op.type === 'payment' &&
      op.asset_type !== 'native' &&
      op.asset_code === assetCode &&
      op.asset_issuer === issuerPublicKey
    ) {
      recipients.add(op.to);
    }
  });

  const results: {
    publicKey: string;
    balance: string | null;
    error?: string;
  }[] = [];

  for (const publicKey of recipients) {
    try {
      const account = await server.loadAccount(publicKey);

      const bludBalance = account.balances.find(b => {
        // Type narrowing
        if (
          (b.asset_type === 'credit_alphanum4' || b.asset_type === 'credit_alphanum12') &&
          b.asset_code === assetCode &&
          b.asset_issuer === issuerPublicKey
        ) {
          return true;
        }
        return false;
      });

      results.push({
        publicKey,
        balance: bludBalance ? bludBalance.balance : '0',
      });
    } catch (err: any) {
      results.push({
        publicKey,
        balance: null,
        error: err.message,
      });
    }
  }

  return results;
};
