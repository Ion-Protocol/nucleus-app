import { TokenKey } from '@/config/token'

export enum MarketKey {
  WEETH_WSTETH = 'weETH_wstETH',
  RSETH_WSTETH = 'rsETH_wstETH',
  RSWETH_WSTETH = 'rswETH_wstETH',
  EZETH_WETH = 'ezETH_WETH',
}

export interface MarketContracts {
  reserveOracle: `0x${string}`
  ionPool: `0x${string}`
}

export interface Market {
  id: number
  key: MarketKey
  contracts: MarketContracts
  collateralAsset: TokenKey
  lenderAsset: TokenKey
}
