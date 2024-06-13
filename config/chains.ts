import { Chain } from '@/types/Chain'

export enum ChainKey {
  ETHEREUM = 'ethereum',
  TEST = 'test',
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
  },
  [ChainKey.TEST]: {
    name: 'test',
  },
}
