import { ChainKey } from '@/types/ChainKey'
import { mainnet, sei } from 'viem/chains'
import { rari, swellchain } from './customWagmiChains'

export interface Chain {
  name: string
  id?: number | null
  nativeCurrency?: { name: string; symbol: string; decimals: number }
  contracts?: {
    merkelClaim?: `0x${string}`
  }
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
    id: mainnet.id,
  },
  [ChainKey.SEI]: {
    name: 'Sei',
    id: sei.id,
    contracts: {
      merkelClaim: '0xa89e0b81cCF4d7d44cdf1aDd9BcfaCf651d97499',
    },
  },
  [ChainKey.SWELL]: {
    name: 'Swell',
    id: swellchain.id,
  },
  [ChainKey.ECLIPSE]: {
    name: 'Eclipse',
  },
  [ChainKey.DINERO]: {
    name: 'Dinero',
  },
  [ChainKey.FORM]: {
    name: 'Form',
  },
  [ChainKey.UNIFI]: {
    name: 'UniFi',
  },
  [ChainKey.RARI]: {
    name: 'Rari',
    id: rari.id,
  },
}
