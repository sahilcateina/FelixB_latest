// src/services/stellar.service.ts
import { Horizon, Keypair, Networks, TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';
import { Transaction } from '@stellar/stellar-sdk';
const server = new Horizon.Server('https://horizon-testnet.stellar.org');





export const BLUD_ASSET = new Asset('BLUD', 'GDQKTZNJ5EYRYE7SXSGIWR3NKOCMPAP3VW2LXQDWYXODVWJFLZ4C34QN');

export const createAccount = async () => {
  const pair = Keypair.random();

  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
  );

  if (!response.ok) {
    throw new Error('Failed to fund account with Friendbot.');
  }

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


export const establishBLUDTrustline = async (
    accountSecret: string,
    limit: string = '100000'
  ) => {
    const keypair = Keypair.fromSecret(accountSecret);
    const account = await server.loadAccount(keypair.publicKey());
  
    const transaction = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset: BLUD_ASSET, limit }))
      .setTimeout(30)
      .build();
  
    transaction.sign(keypair);
    const result = await server.submitTransaction(transaction);
  
    return {
      success: true,
      message: `Trustline for BLUD established with limit ${limit}`,
      result,
    };
  };
  
  export const submitSignedTransactionXDR = async (signedXDR: string) => {
    try {
      // ✅ Convert XDR string back into a Transaction object
      const transaction = TransactionBuilder.fromXDR(signedXDR, Networks.TESTNET);
  
      // ✅ Submit the transaction object
      const result = await server.submitTransaction(transaction);
  
      return {
        success: true,
        message: 'Pre-signed transaction submitted successfully',
        result,
      };
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.extras?.result_codes
          ? JSON.stringify(e.response.data.extras.result_codes, null, 2)
          : e.message;
      return {
        success: false,
        message: 'Failed to submit signed transaction',
        error: errorMsg,
      };
    }
  };
  

















// // src/services/stellar.service.ts
// import { Keypair, Operation, TransactionBuilder, Asset, Networks } from '@stellar/stellar-sdk';
// import * as stellarDao from '../dao/stellar.dao';
// import { BLUD_ASSET } from '../dao/stellar.dao'; // Import BLUD_ASSET from DAO
// import { StellarResult } from '../types/stellar.types';

// const NETWORK_PASSPHRASE = Networks.TESTNET; // Consistent network for transactions

// /**
//  * Helper to build and submit a transaction.
//  * This function handles fetching fee, signing, and error processing.
//  */
// async function buildAndSubmit(
//     sourceKeypair: Keypair,
//     operations: Operation[],
//     operationDescription: string = 'Stellar Operation'
// ): Promise<StellarResult> {
//     try {
//         const sourceAccount = await stellarDao.loadAccount(sourceKeypair.publicKey());
//         const baseFee = await stellarDao.fetchBaseFee();

//         const transaction = new TransactionBuilder(sourceAccount, {
//             fee: baseFee.toString(),
//             networkPassphrase: NETWORK_PASSPHRASE,
//         })
//             .addOperations(operations)
//             .setTimeout(30)
//             .build();

//         transaction.sign(sourceKeypair);

//         console.log(`Submitting ${operationDescription} transaction...`);
//         const transactionResult = await stellarDao.submitTransaction(transaction.toXDR());
//         console.log(`${operationDescription} Transaction successful! Hash: ${transactionResult.hash}`);
//         return { success: true, message: 'Transaction successful', result: transactionResult };
//     } catch (e: any) {
//         console.error(`Error during ${operationDescription} transaction:`);
//         let errorMessage = e.message;
//         if (e.response && e.response.data && e.response.data.extras) {
//             errorMessage = `Horizon Error: ${JSON.stringify(e.response.data.extras.result_codes, null, 2)}`;
//             console.error('Horizon Response:', JSON.stringify(e.response.data, null, 2));
//         } else {
//             console.error(e);
//         }
//         return { success: false, message: `Failed to ${operationDescription}: ${errorMessage}`, error: e };
//     }
// }

// /**
//  * Creates a new Stellar account and funds it with XLM using Friendbot (Testnet only).
//  */
// export const createAccountAndFund = async (): Promise<StellarResult> => {
//     const pair = Keypair.random();
//     try {
//         const response = await stellarDao.fundWithFriendbot(pair.publicKey());
//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Friendbot funding failed: ${response.status} ${response.statusText} - ${errorText}`);
//         }
//         return {
//             success: true,
//             message: 'Testnet Stellar account created and funded with XLM.',
//             publicKey: pair.publicKey(),
//             secretKey: pair.secret(),
//         };
//     } catch (error: any) {
//         console.error('Service error creating/funding account:', error);
//         return { success: false, message: `Failed to create Stellar account: ${error.message}`, error: error };
//     }
// };

// /**
//  * Establishes a trustline for an account to hold BLUD.
//  * @param accountSecret The secret key of the account establishing the trustline.
//  * @param limit The maximum amount of BLUD this account is willing to hold.
//  */
// export const establishBLUDTrustline = async (accountSecret: string, limit: string = Asset.MAX_SPONSORSHIP_LIMIT): Promise<StellarResult> => {
//     const accountKeypair = Keypair.fromSecret(accountSecret);
//     const operation = Operation.changeTrust({ asset: BLUD_ASSET, limit: limit });
//     return buildAndSubmit(accountKeypair, [operation], 'Establish BLUD Trustline');
// };

// /**
//  * Issues (mints) new BLUD from the BLUD Issuer account to a destination.
//  * @param issuerSecret The secret key of the BLUD issuer account.
//  * @param destinationPublicKey The public key of the recipient.
//  * @param amount The amount of BLUD to issue.
//  */
// export const issueBLUD = async (issuerSecret: string, destinationPublicKey: string, amount: string): Promise<StellarResult> => {
//     const issuerKeypair = Keypair.fromSecret(issuerSecret);
//     if (issuerKeypair.publicKey() !== BLUD_ASSET.issuer) {
//         return { success: false, message: 'Provided issuerSecret does not match BLUD_ISSUER_PUBLIC_KEY configuration.' };
//     }

//     try {
//         const destAccountInfo = await stellarDao.loadAccount(destinationPublicKey);
//         const hasTrustline = destAccountInfo.balances.some(
//             b => b.asset_code === BLUD_ASSET.code && b.asset_issuer === BLUD_ASSET.issuer
//         );
//         if (!hasTrustline) {
//             return { success: false, message: `Destination account ${destinationPublicKey} does not have a trustline for BLUD. Please establish one first.` };
//         }
//     } catch (e: any) {
//         if (e.response && e.response.status === 404) {
//             return { success: false, message: `Destination account ${destinationPublicKey} does not exist. It needs to be created and have a BLUD trustline.` };
//         }
//         throw e; // Re-throw other errors
//     }

//     const operation = Operation.payment({ destination: destinationPublicKey, asset: BLUD_ASSET, amount });
//     return buildAndSubmit(issuerKeypair, [operation], `Issue ${amount} BLUD`);
// };

// /**
//  * Sends a payment of BLUD from a source account to a destination account.
//  * @param sourceSecret The secret key of the sender account.
//  * @param destinationPublicKey The public key of the recipient.
//  * @param amount The amount of BLUD to send.
//  */
// export const sendBLUDPayment = async (sourceSecret: string, destinationPublicKey: string, amount: string): Promise<StellarResult> => {
//     const sourceKeypair = Keypair.fromSecret(sourceSecret);

//     try {
//         const destAccountInfo = await stellarDao.loadAccount(destinationPublicKey);
//         const hasTrustline = destAccountInfo.balances.some(
//             b => b.asset_code === BLUD_ASSET.code && b.asset_issuer === BLUD_ASSET.issuer
//         );
//         if (!hasTrustline) {
//             return { success: false, message: `Destination account ${destinationPublicKey} does not have a trustline for BLUD. Please establish one first.` };
//         }
//     } catch (e: any) {
//         if (e.response && e.response.status === 404) {
//             return { success: false, message: `Destination account ${destinationPublicKey} does not exist.` };
//         }
//         throw e;
//     }

//     const operation = Operation.payment({ destination: destinationPublicKey, asset: BLUD_ASSET, amount });
//     return buildAndSubmit(sourceKeypair, [operation], `Send ${amount} BLUD`);
// };

// /**
//  * Creates, updates, or deletes a sell offer for BLUD on the Stellar DEX.
//  * @param sourceSecret The secret key of the account placing the offer.
//  * @param amountBLUDToSell The amount of BLUD to sell.
//  * @param pricePerBLUDInBuyingAsset The price of 1 BLUD in terms of the buying asset.
//  * @param buyingAsset The asset to buy (defaults to XLM).
//  * @param offerId Existing offer ID to update/delete, or '0' for a new offer.
//  */
// export const createBLUDSellOffer = async (
//     sourceSecret: string,
//     amountBLUDToSell: string,
//     pricePerBLUDInBuyingAsset: string,
//     buyingAsset: Asset = Asset.native(),
//     offerId: string = '0'
// ): Promise<StellarResult> => {
//     const sourceKeypair = Keypair.fromSecret(sourceSecret);
//     const operation = Operation.manageSellOffer({
//         selling: BLUD_ASSET,
//         buying: buyingAsset,
//         amount: amountBLUDToSell,
//         price: pricePerBLUDInBuyingAsset,
//         offerId: offerId,
//     });
//     return buildAndSubmit(sourceKeypair, [operation], `Create BLUD Sell Offer`);
// };

// /**
//  * Creates, updates, or deletes a buy offer for BLUD on the Stellar DEX.
//  * @param sourceSecret The secret key of the account placing the offer.
//  * @param amountBLUDToBuy The amount of BLUD to buy.
//  * @param pricePerBLUDInSellingAsset The price of 1 BLUD in terms of the selling asset.
//  * @param sellingAsset The asset to sell (defaults to XLM).
//  * @param offerId Existing offer ID to update/delete, or '0' for a new offer.
//  */
// export const createBLUDBuyOffer = async (
//     sourceSecret: string,
//     amountBLUDToBuy: string,
//     pricePerBLUDInSellingAsset: string,
//     sellingAsset: Asset = Asset.native(),
//     offerId: string = '0'
// ): Promise<StellarResult> => {
//     const sourceKeypair = Keypair.fromSecret(sourceSecret);
//     const operation = Operation.manageBuyOffer({
//         buying: BLUD_ASSET,
//         selling: sellingAsset,
//         buyAmount: amountBLUDToBuy,
//         price: pricePerBLUDInSellingAsset,
//         offerId: offerId,
//     });
//     return buildAndSubmit(sourceKeypair, [operation], `Create BLUD Buy Offer`);
// };

// /**
//  * Submits a pre-signed transaction XDR received from a client.
//  * @param signedXDR The XDR string of the already signed transaction.
//  */
// export const submitSignedTransactionXDR = async (signedXDR: string): Promise<StellarResult> => {
//     try {
//         const transactionResult = await stellarDao.submitTransaction(signedXDR);
//         return { success: true, message: 'Pre-signed transaction submitted successfully', result: transactionResult };
//     } catch (e: any) {
//         console.error('Service error submitting pre-signed transaction XDR:', e);
//         let errorMessage = e.message;
//         if (e.response && e.response.data && e.response.data.extras) {
//             errorMessage = `Horizon Error: ${JSON.stringify(e.response.data.extras.result_codes, null, 2)}`;
//             console.error('Horizon Response:', JSON.stringify(e.response.data, null, 2));
//         } else {
//             console.error(e);
//         }
//         return { success: false, message: `Failed to submit pre-signed transaction: ${errorMessage}`, error: e };
//     }
// };

// /**
//  * Retrieves the current balance of an account for a specific asset.
//  * @param publicKey The public key of the account.
//  * @param assetCode The code of the asset (e.g., 'BLUD', 'XLM'). Defaults to 'BLUD'.
//  * @param issuer The issuer of the asset (required for custom assets). Defaults to BLUD_ISSUER_PUBLIC_KEY.
//  */
// export const getAccountBalance = async (publicKey: string, assetCode: string = BLUD_ASSET.code, issuer?: string): Promise<StellarResult> => {
//     try {
//         const account = await stellarDao.loadAccount(publicKey);

//         let targetAsset: Asset | 'native';
//         if (assetCode.toUpperCase() === 'XLM' || assetCode.toUpperCase() === 'NATIVE') {
//             targetAsset = 'native';
//         } else {
//             if (!issuer) {
//                 issuer = BLUD_ASSET.issuer; // Default to BLUD issuer
//             }
//             targetAsset = new Asset(assetCode, issuer);
//         }

//         const balanceEntry = account.balances.find(b => {
//             if (targetAsset === 'native' && b.asset_type === 'native') return true;
//             if (typeof targetAsset !== 'string' && b.asset_code === targetAsset.code && b.asset_issuer === targetAsset.issuer) return true;
//             return false;
//         });

//         if (balanceEntry) {
//             return { success: true, balance: balanceEntry.balance, asset: balanceEntry.asset_code || 'XLM' };
//         } else {
//             return { success: false, message: `Balance for ${assetCode} not found or trustline not established for ${publicKey}.` };
//         }
//     } catch (error: any) {
//         console.error(`Service error fetching balance for ${publicKey}, ${assetCode}:`, error);
//         if (error.response && error.response.status === 404) {
//             return { success: false, message: `Account ${publicKey} not found on the Stellar network.` };
//         }
//         return { success: false, message: `Failed to fetch balance: ${error.message}` };
//     }
// };

// /**
//  * Retrieves all offers (buy/sell orders) for a given account.
//  * @param publicKey The public key of the account.
//  */
// export const getAccountOffers = async (publicKey: string): Promise<StellarResult> => {
//     try {
//         const offers = await stellarDao.getOffersForAccount(publicKey);
//         return { success: true, offers: offers };
//     } catch (error: any) {
//         console.error(`Service error fetching offers for ${publicKey}:`, error);
//         if (error.response && error.response.status === 404) {
//             return { success: false, message: `Account ${publicKey} not found on the Stellar network.` };
//         }
//         return { success: false, message: `Failed to fetch offers: ${error.message}` };
//     }
// };

// /**
//  * Retrieves detailed account information (sequence number, signers, etc.).
//  * @param publicKey The public key of the account.
//  */
// export const getAccountDetails = async (publicKey: string): Promise<StellarResult> => {
//     try {
//         const account = await stellarDao.loadAccount(publicKey);
//         return { success: true, message: 'Account details fetched', account: account };
//     } catch (error: any) {
//         console.error(`Service error fetching account details for ${publicKey}:`, error);
//         if (error.response && error.response.status === 404) {
//             return { success: false, message: `Account ${publicKey} not found on the Stellar network.` };
//         }
//         return { success: false, message: `Failed to fetch account details: ${error.message}` };
//     }
// };