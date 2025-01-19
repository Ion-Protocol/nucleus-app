import type { Chain } from '@funkit/connect'
import { boba as bobaWagmi, sei as seiWagmi } from 'wagmi/chains'

export const sei = {
  ...seiWagmi,
  iconUrl: '/assets/svgs/sei.svg',
}

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

export const swellchain = {
  id: 1923,
  name: 'Swell',
  iconUrl: '/assets/svgs/swell-chain.svg',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://swell-mainnet.alt.technology'] },
    default: { http: ['https://swell-mainnet.alt.technology'] },
  },
  blockExplorers: {
    etherscan: { name: 'Swell Chain Explorer', url: 'https://explorer.swellnetwork.io' },
    default: { name: 'Swell Chain Explorer', url: 'https://explorer.swellnetwork.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
} as const satisfies Chain

export const bobanetwork = {
  ...bobaWagmi,
  iconUrl: '/assets/svgs/boba-network.svg',
  // nativeCurrency: {
  //   name: 'Ether',
  //   symbol: 'ETH',
  //   decimals: 18,
  // },
  // rpcUrls: {
  //   public: { http: ['https://mainnet.boba.network'] },
  //   default: { http: ['https://mainnet.boba.network'] },
  // },
  // blockExplorers: {
  //   etherscan: { name: 'Bobascan Ecosystem Explorer', url: 'https://bobascan.com' },
  //   default: { name: 'Bobascan Ecosystem Explorer', url: 'https://bobascan.com' },
  // },
  // contracts: {
  //   multicall3: {
  //     address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  //   },
  // },
} as const satisfies Chain
