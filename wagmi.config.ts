import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';
import { celo, celoAlfajores } from 'wagmi/chains';

// Define network configurations
const celoNetworks = {
  [celo.id]: {
    // You might need to add specific deployment addresses here later
    // Example: DonationPool: '0x...',
  },
  [celoAlfajores.id]: {
    // Example: DonationPool: '0x...',
  },
};

export default defineConfig({
  out: 'src/lib/wagmi/contracts.ts', // Output file for generated hooks
  contracts: [], // We'll let the foundry plugin handle contracts
  plugins: [
    foundry({
      project: './contracts', // Explicit relative path
      include: [
        'Pool.sol/Pool.json', // Original Pool contract
        'DonationPool.sol/DonationPool.json', // Adding DonationPool contract
        // Specify contracts to include, or leave empty to include all artifacts
        // Example: 'PoolEscrow.sol/**', 'DirectPay.sol/**'
      ],
      deployments: celoNetworks, // Map deployments to Celo/Alfajores
      // You might need to adjust deployments based on actual contract deployment addresses
    }),
  ],
}); 