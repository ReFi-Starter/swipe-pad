// apps/MiniPay/lib/transaction.ts
import { writeContract, getPublicClient, getWalletClient } from 'wagmi/actions';
import { Address, parseUnits } from 'viem';
import { 
  CELO_MAINNET_ID, 
  USDT_ADDRESS, 
  USDT_ADAPTER_ADDRESS, 
  SUPPORTED_STABLECOINS 
} from './constants'; 
// NOTE: You must define the ERC20 ABI locally or import it from a utility

// Example function to send a donation using a stablecoin (USDT or cUSD)
export async function sendSwipeDonation(
  recipientAddress: Address, 
  amount: string, 
  stablecoinSymbol: 'USDT' | 'cUSD',
  userAddress: Address
) {
  // 1. Get the correct coin and decimals
  const coin = SUPPORTED_STABLECOINS.find(s => s.symbol === stablecoinSymbol);
  if (!coin) throw new Error('Unsupported stablecoin.');

  // 2. Determine the fee currency address (Adapter for USDT, Token for cUSD)
  // USDT requires the Adapter address for fee abstraction due to its 6-decimal standard.
  // MiniPay supports setting the feeCurrency property when running eth_sendTransaction.
  const feeCurrency = coin.isAdapter ? coin.feeAdapter : coin.address;

  // 3. Prepare the transaction arguments
  const parsedAmount = parseUnits(amount, coin.decimals);
  
  // NOTE: You must have the ERC20_ABI defined in your project.
  const transactionRequest = {
    address: coin.address, // The stablecoin contract address
    abi: ERC20_ABI, // Replace with your actual ERC20 ABI
    functionName: 'transfer',
    args: [recipientAddress, parsedAmount],
    // The Celo-specific feeCurrency field is vital for MiniPay transactions
    feeCurrency: feeCurrency as Address, 
    chain: CELO_MAINNET_ID,
    account: userAddress,
  };

  try {
    // 4. Execute the contract write via Wagmi/Viem
    const hash = await writeContract(config, transactionRequest);
    console.log(`Transaction submitted: ${hash}`);
    return hash;
  } catch (error) {
    console.error('Donation failed:', error);
    throw error;
  }
}
