import { Chain } from '@/types/Chain'
import { TokenKey } from './token'

export enum ChainKey {
  ETHEREUM = 'ethereum',
  TEST = 'test',
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
  },
  [ChainKey.TEST]: {
    name: 'test',
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
  },
}
