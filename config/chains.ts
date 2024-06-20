import { Chain } from '@/types/Chain'
import { TokenKey } from './token'
import { MarketKey } from '@/types/Market'

export enum ChainKey {
  ETHEREUM = 'ethereum',
  TENDERLY = 'tenderly',
}

export const chainsConfig: Record<ChainKey, Chain> = {
  ////////////////////////////////////////
  // Ethereum
  ////////////////////////////////////////
  [ChainKey.ETHEREUM]: {
    id: 1,
    name: 'Ethereum',
    availableTokens: [TokenKey.WETH, TokenKey.WSTETH],
    markets: {
      [MarketKey.WEETH_WSTETH]: {
        id: 0,
        collateralAsset: TokenKey.WEETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x0000000000eaEbd95dAfcA37A39fd09745739b78',
          reserveOracle: '0x78C3ac7F84F5101422DCd89fB387bD0DeEf8d662',
        },
      },
      [MarketKey.RSETH_WSTETH]: {
        id: 1,
        collateralAsset: TokenKey.RSETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x0000000000E33e35EE6052fae87bfcFac61b1da9',
          reserveOracle: '0x095FE689AFC3e57bb32Bc06Fd45aD2382f47e2fd',
        },
      },
      [MarketKey.RSWETH_WSTETH]: {
        id: 2,
        collateralAsset: TokenKey.RSWETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x00000000007C8105548f9d0eE081987378a6bE93',
          reserveOracle: '0xAAa88236D483f08003493adbbf451373992f2f58',
        },
      },
      [MarketKey.EZETH_WETH]: {
        id: 3,
        collateralAsset: TokenKey.EZETH,
        lenderAsset: TokenKey.WETH,
        contracts: {
          ionPool: '0x00000000008a3A77bd91bC738Ed2Efaa262c3763',
          reserveOracle: '0x3239396B740cD6BBABb42196A03f7B77fA7102C9',
        },
      },
    },
  },

  ////////////////////////////////////////
  // Tenderly
  ////////////////////////////////////////
  [ChainKey.TENDERLY]: {
    id: 99099127,
    name: 'Ion Testnet',
    availableTokens: [TokenKey.WETH, TokenKey.WSTETH],
    markets: {
      [MarketKey.WEETH_WSTETH]: {
        id: 0,
        collateralAsset: TokenKey.WEETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          reserveOracle: '0x78C3ac7F84F5101422DCd89fB387bD0DeEf8d662',
          ionPool: '0x0000000000eaEbd95dAfcA37A39fd09745739b78',
        },
      },
      [MarketKey.RSETH_WSTETH]: {
        id: 1,
        collateralAsset: TokenKey.RSETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          reserveOracle: '0x095FE689AFC3e57bb32Bc06Fd45aD2382f47e2fd',
          ionPool: '0x0000000000E33e35EE6052fae87bfcFac61b1da9',
        },
      },
      [MarketKey.RSWETH_WSTETH]: {
        id: 2,
        collateralAsset: TokenKey.RSWETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x00000000007C8105548f9d0eE081987378a6bE93',
          reserveOracle: '0xAAa88236D483f08003493adbbf451373992f2f58',
        },
      },
      [MarketKey.EZETH_WETH]: {
        id: 3,
        collateralAsset: TokenKey.EZETH,
        lenderAsset: TokenKey.WETH,
        contracts: {
          ionPool: '0x00000000008a3A77bd91bC738Ed2Efaa262c3763',
          reserveOracle: '0x3239396B740cD6BBABb42196A03f7B77fA7102C9',
        },
      },
    },
  },
}
