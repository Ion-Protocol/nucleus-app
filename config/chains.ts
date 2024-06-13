import { Chain } from '@/types/Chain'
import { TokenKey } from './token'

export enum ChainKey {
  ETHEREUM = 'ethereum',
}

export const chainsConfig: Record<ChainKey, Chain> = {
  [ChainKey.ETHEREUM]: {
    name: 'Ethereum',
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
  },
}
