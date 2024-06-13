import { Chain } from '@/types/Chain'

export enum ChainKey {
  ETHEREUM = 'ethereum',
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
  },
}
