import { Chain } from '@/types/Chain'
import { Token } from '@/types/Token'

export enum TokenKey {
  ETH = 'eth',
  WETH = 'weth',
  WSTETH = 'wsteth',
}

export const tokensConfig: Record<TokenKey, Token> = {
  [TokenKey.ETH]: {
    name: 'ETH',
    symbol: 'ETH',
    address: '0x',
  },
  [TokenKey.WETH]: {
    name: 'Weth',
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  [TokenKey.WSTETH]: {
    name: 'WstETH',
    symbol: 'wstETH',
    address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  },
}
