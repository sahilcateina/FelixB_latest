import * as StellarSdk from '@stellar/stellar-sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for write access
  );
  

  const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export const loadAccount = (publicKey: string) => server.loadAccount(publicKey);
//export const submitTransaction = (xdr: string) => server.submitTransaction(xdr);


export const saveStellarAccount = async (publicKey: string, secretKey: string) => {
    const { data, error } = await supabase
      .from('stellar_accounts')
      .insert([{ 
        public_key: publicKey,
        secret_key: secretKey
    }]);
  
    if (error) {
      throw new Error(`Error saving Stellar account: ${error.message}`);
    }
  
    return data;
  };

  export interface Service {
    id?: string;
    seller_public_key: string;
    name: string;
    description: string;
    blud_price: string;
    status: 'available' | 'sold' | 'cancelled';
    created_at?: string;
  }



  export const createService = async (service: Omit<Service, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select();
  
    if (error) {
      throw new Error(`Error creating service: ${error.message}`);
    }
  
    return data?.[0];
  };
  
  export const getService = async (id: string) => {
    const { data, error } = await supabase
      .from('services')
      .select()
      .eq('id', id)
      .single();
  
    if (error) {
      throw new Error(`Error getting service: ${error.message}`);
    }
  
    return data;
  };
  
  export const updateService = async (id: string, updates: Partial<Service>) => {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select();
  
    if (error) {
      throw new Error(`Error updating service: ${error.message}`);
    }
  
    return data?.[0];
  };
  
  // Service Transaction table operations
  export interface ServiceTransaction {
    id?: string;
    service_id: string;
    buyer_public_key: string;
    seller_public_key: string;
    blud_amount: string;
    transaction_hash: string;
    created_at?: string;
  }
  
  export const createServiceTransaction = async (transaction: Omit<ServiceTransaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('service_transactions')
      .insert([transaction])
      .select();
  
    if (error) {
      throw new Error(`Error creating service transaction: ${error.message}`);
    }
  
    return data?.[0];
  };



  export const getAvailableServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      //.eq('status', 'available')
      .order('created_at', { ascending: false });
  
    if (error) {
      throw new Error(`Error fetching available services: ${error.message}`);
    }
  
    return data;
  };
  

  

// Save newly created asset
export const saveAsset = async ({
  asset_code,
  issuer_public_key
}: {
  asset_code: string;
  issuer_public_key: string;
}) => {
  const { data, error } = await supabase
    .from('assets')
    .insert([{ asset_code, issuer_public_key }])
    .select();

  if (error) {
    throw new Error(`Error saving asset: ${error.message}`);
  }

  return data?.[0];
};

// Fetch all created assets
export const getAllAssets = async () => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching assets: ${error.message}`);
  }

  return data;
};


