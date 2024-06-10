import { Chain } from '@rainbow-me/rainbowkit'

const TENDERLY_STAGING_RPC_URL = process.env.PUBLIC_NEXT_TENDERLY_STAGING_RPC_URL || ''
const TENDERLY_STAGING_CHAIN_ID = 99099127

export const tenderlyStaging: Chain = {
  id: TENDERLY_STAGING_CHAIN_ID,
  name: 'Ion Protocol Staging',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [TENDERLY_STAGING_RPC_URL],
    },
    public: {
      http: [TENDERLY_STAGING_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ion Protocol Staging Explorer',
      url: `https://dashboard.tenderly.co/ion-protocol/money-market-v1/testnet/71701faf-e853-4997-979e-51d7c3968d54`,
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  testnet: true,
}
