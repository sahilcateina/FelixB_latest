import { Server } from '@stellar/stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');

export const loadAccount = (publicKey: string) => server.loadAccount(publicKey);
export const submitTransaction = (xdr: string) => server.submitTransaction(xdr);









// import { Horizon, Networks, Server, Transaction, Keypair, Asset } from '@stellar/stellar-sdk';
// import fetch from 'node-fetch'; // For Node.js versions <18 that don't have global fetch

// // Polyfill for Stellar SDK in Node.js environments (if needed)
// if (typeof globalThis.fetch === 'undefined') {
//   globalThis.fetch = fetch as any;
// }

// // --- Configuration ---
// const HORIZON_URL = 'https://horizon-testnet.stellar.org';
// const NETWORK_PASSPHRASE = Networks.TESTNET;

// export const horizonServer = new Server(HORIZON_URL);

// // !!! IMPORTANT: Define your BLUD Asset and its Issuer Public Key !!!
// // This is a core data-related constant for your application.
// const BLUD_ISSUER_PUBLIC_KEY = 'GAVK7H262Y6W63C6XW3P3K27B6R24M4TXYL66A3P7K2N7K6D6A2S7S7S7S7S7S7S7S'; // <<<< REPLACE THIS WITH YOUR ACTUAL ISSUER PUBLIC KEY

// export const BLUD_ASSET = new Asset('BLUD', BLUD_ISSUER_PUBLIC_KEY);

// /**
//  * Directly submits a signed Stellar transaction to Horizon.
//  * @param transactionXDR The XDR string of the signed transaction.
//  * @returns Horizon's response to the submission.
//  */
// export async function submitTransaction(transactionXDR: string): Promise<Horizon.SubmitTransactionResponse> {
//     return horizonServer.submitTransaction(transactionXDR);
// }

// /**
//  * Loads account data from Horizon.
//  * @param publicKey The public key of the account.
//  * @returns Horizon's account response.
//  */
// export async function loadAccount(publicKey: string): Promise<Horizon.AccountResponse> {
//     return horizonServer.loadAccount(publicKey);
// }

// /**
//  * Fetches the current base fee from Horizon.
//  * @returns The base fee in stroops.
//  */
// export async function fetchBaseFee(): Promise<number> {
//     return horizonServer.fetchBaseFee();
// }

// /**
//  * Fetches offers for a specific account.
//  * @param publicKey The public key of the account.
//  * @returns An array of offer records.
//  */
// export async function getOffersForAccount(publicKey: string): Promise<Horizon.OfferRecord[]> {
//     const offers = await horizonServer.offers().forAccount(publicKey).call();
//     return offers.records;
// }

// /**
//  * Helper to get Friendbot funding (Testnet only).
//  * @param publicKey The public key to fund.
//  */
// export async function fundWithFriendbot(publicKey: string): Promise<Response> {
//     return fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
// }