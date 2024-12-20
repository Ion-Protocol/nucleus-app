import { Chain } from '@funkit/connect'
import { sei as seiWagmi } from 'wagmi/chains'

const TENDERLY_RPC_URL = process.env.NEXT_PUBLIC_TENDERLY_RPC_URL || ''
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
      http: [TENDERLY_RPC_URL],
    },
    public: {
      http: [TENDERLY_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ion Protocol Staging Explorer',
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
// TODO Should move custom chain configs into own file
export const rari = {
  id: 1380012617,
  name: 'Rari',
  iconUrl: '/assets/svgs/rari.svg',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://rari.calderachain.xyz/infra-partner-http'] },
    default: { http: ['https://rari.calderachain.xyz/infra-partner-http'] },
  },
  blockExplorers: {
    etherscan: { name: 'Blockscout', url: 'https://mainnet.explorer.rarichain.org/' },
    default: { name: 'Blockscout', url: 'https://mainnet.explorer.rarichain.org/' },
  },
  contracts: {
    multicall3: {
      address: '0x3F5Fc48153f8aDd3E429F0c84fA6FEd5c58657Dc',
    },
  },
} as const satisfies Chain
