import { getEthPerStEth } from '@/api/contracts/WstETH/stEthPerToken'
import { Token } from '@/types/Token'

export enum TokenKey {
  ETH = 'eth',
  WETH = 'weth',
  WEETH = 'weETH',
  WSTETH = 'wstETH',
  SEI = 'sei',
  RSETH = 'rsETH',
  RSWETH = 'rswETH',
  EZETH = 'ezETH',
}

async function oneAsBigInt(): Promise<bigint> {
  return BigInt(1e18)
}

export const tokensConfig: Record<TokenKey, Token> = {
  [TokenKey.ETH]: {
    name: 'ETH',
    symbol: 'ETH',
    address: '0x0',
    getPrice: oneAsBigInt,
  },
  [TokenKey.WETH]: {
    name: 'Weth',
    symbol: 'WETH',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    getPrice: oneAsBigInt,
  },
  [TokenKey.WEETH]: {
    name: 'weETH',
    symbol: 'WEETH',
    address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    getPrice: oneAsBigInt,
  },
  [TokenKey.WSTETH]: {
    name: 'wstETH',
    symbol: 'WSTETH',
    address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    getPrice: getEthPerStEth,
  },
  [TokenKey.SEI]: {
    name: 'SEI',
    symbol: 'SEI',
    address: '0x9c1CB740f3b631ed53600058ae5B2f83E15d9fBF',
    getPrice: oneAsBigInt,
  },
  [TokenKey.RSETH]: {
    name: 'rsETH',
    symbol: 'RSETH',
    address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
    getPrice: oneAsBigInt,
  },
  [TokenKey.RSWETH]: {
    name: 'rswETH',
    symbol: 'RSWETH',
    address: '0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
    getPrice: oneAsBigInt,
  },
  [TokenKey.EZETH]: {
    name: 'ezETH',
    symbol: 'EZETH',
    address: '0xbf5495efe5db9ce00f80364c8b423567e58d2110',
    getPrice: oneAsBigInt,
  },
}
