import { Chain } from '@funkit/connect'
import { sei as seiWagmi } from 'wagmi/chains'

const TENDERLY_SAI_RPC_URL = process.env.NEXT_PUBLIC_TENDERLY_RPC_URL || ''
const TENDERLY_ETHEREUM_L1_RPC_URL = process.env.NEXT_PUBLIC_ETHEREUM_STAGING_L1_RPC_URL || ''
const TENDERLY_ETHEREUM_L2_RPC_URL = process.env.NEXT_PUBLIC_ETHEREUM_STAGING_L2_RPC_URL || ''
const TENDERLY_STAGING_CHAIN_ID = 1330

export const tenderlyStaging: Chain = {
  id: TENDERLY_STAGING_CHAIN_ID,
  iconUrl: '/assets/svgs/sei.svg',
  name: 'Sei Staging',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [TENDERLY_SAI_RPC_URL],
    },
    public: {
      http: [TENDERLY_SAI_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ion Protocol Staging Explorer',
      // TODO: Update the id at the end of the url with the TENDERLY_ID env var
      url: `https://dashboard.tenderly.co/ion-protocol/money-market-v1/testnet/7afc9000-8550-47bc-92dc-28eb37aab81b`,
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  testnet: true,
}

export const ethereumStagingL1: Chain = {
  id: 308712,
  iconUrl: '/assets/svgs/token-weth.svg',
  name: 'Ethereum Staging L1',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [TENDERLY_ETHEREUM_L1_RPC_URL],
    },
    public: {
      http: [TENDERLY_ETHEREUM_L1_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Staging Explorer - Ethereum L1',
      // TODO: Update the id at the end of the url with the TENDERLY_ID env var
      url: `https://dashboard.tenderly.co/ion-protocol/money-market-v1/testnet/7afc9000-8550-47bc-92dc-28eb37aab81b`,
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  testnet: true,
}

export const ethereumStagingL2: Chain = {
  id: 2,
  iconUrl: '/assets/svgs/token-weth.svg',
  name: 'Ethereum Staging L2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [TENDERLY_ETHEREUM_L2_RPC_URL],
    },
    public: {
      http: [TENDERLY_ETHEREUM_L2_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Staging Explorer - Ethereum L2',
      // TODO: Update the id at the end of the url with the TENDERLY_ID env var
      url: `https://dashboard.tenderly.co/ion-protocol/money-market-v1/testnet/7afc9000-8550-47bc-92dc-28eb37aab81b`,
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  testnet: true,
}

export const sei = {
  ...seiWagmi,
  iconUrl: '/assets/svgs/sei.svg',
}
