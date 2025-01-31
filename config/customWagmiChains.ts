import type { Chain } from '@funkit/connect'
import { boba as bobaWagmi, plume as plumeWagmi, sei as seiWagmi } from 'wagmi/chains'
import { formExplorerBaseUrl, rariExplorerBaseUrl, swellExplorerBaseURL } from './constants'

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
    etherscan: { name: 'Blockscout', url: rariExplorerBaseUrl },
    default: { name: 'Blockscout', url: rariExplorerBaseUrl },
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
    etherscan: { name: 'Swell Chain Explorer', url: swellExplorerBaseURL },
    default: { name: 'Swell Chain Explorer', url: swellExplorerBaseURL },
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
} as const satisfies Chain

export const form = {
  id: 478,
  name: 'Form',
  iconUrl: '/assets/svgs/form.svg',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://rpc.form.network/http'] },
    default: { http: ['https://rpc.form.network/http'] },
  },
  blockExplorers: {
    etherscan: { name: 'Form Network Explorer', url: formExplorerBaseUrl },
    default: { name: 'Form Network Explorer', url: formExplorerBaseUrl },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
  sourceId: 1,
} as const satisfies Chain

export const plume = {
  ...plumeWagmi,
  iconUrl: '/assets/svgs/plume.svg',
} as const satisfies Chain
