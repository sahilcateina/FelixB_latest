// src/services/stellar.service.ts
import { Horizon, Keypair, Networks, TransactionBuilder, Operation, Asset } from '@stellar/stellar-sdk';
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

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
