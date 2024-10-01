import { ChainKey } from '@/types/ChainKey'
import { mainnet, sei } from 'viem/chains'
import { etherscanBaseUrl } from './constants'

export interface Chain {
  name: string
  id?: number | null
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
    id: mainnet.id,
  },
  [ChainKey.SEI]: {
    name: 'Sei',
    id: sei.id,
  },
  [ChainKey.SWELL]: {
    name: 'Swell',
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
}
