import { ChainKey } from '@/types/ChainKey'
import { mainnet, sei } from 'viem/chains'

export interface Chain {
  name: string
  id?: number | null
  explorerBaseUrl: string
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
    id: mainnet.id,
    explorerBaseUrl: 'https://layerzeroscan.com/tx/',
  },
  [ChainKey.SEI]: {
    name: 'Sei',
    explorerBaseUrl: 'https://seitrace.com/tx/',
    id: sei.id,
  },
  [ChainKey.SWELL]: {
    name: 'Swell',
    explorerBaseUrl: '',
  },
  [ChainKey.ECLIPSE]: {
    name: 'Eclipse',
    explorerBaseUrl: '',
  },
  [ChainKey.DINERO]: {
    name: 'Dinero',
    explorerBaseUrl: '',
  },
}
