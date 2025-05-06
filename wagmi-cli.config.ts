import { defineConfig } from '@wagmi/cli'
import { foundry } from '@wagmi/cli/plugins'

// Contract deployments by chain - addresses will be added after deployment
const contractDeployments = {
    Pool: undefined,
    DonationPool: undefined,
}

export default defineConfig({
    out: 'src/types/contracts.ts',
    plugins: [
        foundry({
            project: 'contracts',
            include: ['Pool.sol', 'DonationPool.sol'],
            deployments: contractDeployments,
        }),
    ],
})
