import { Bridge } from '@/types/Bridge'
import { TokenKey } from './token'

export enum ChainKey {
  MAINNET = 'mainnet',
  SEPOLIA = 'sepolia',
  TENDERLY_MAINNET = 'tenderly_mainnet',
}

// Use kebab-case (with hyphens) for the values.
// These values are used to define the url paths.
export enum BridgeKey {
  ETHEREUM = 'ethereum',
  SEI = 'sei',
  MORPH = 'morph',
  OPTIMISM = 'optimism',
}

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

export interface ChainConfig {
  id: number
  name: string
  markets: Partial<Record<MarketKey, Market>>
  bridges: Partial<Record<BridgeKey, Bridge>>
  contracts: Record<string, `0x${string}`>
}

export const chainsConfig: Record<ChainKey, ChainConfig> = {
  ////////////////////////////////////////
  // Mainnet
  ////////////////////////////////////////

  [ChainKey.MAINNET]: {
    id: 1,
    name: 'Ethereum',
    contracts: {
      chainlink: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      ionLens: '0xe89AF12af000C4f76a57A3aD16ef8277a727DC81',
    },
    bridges: {
      [BridgeKey.MORPH]: {
        name: 'Morph',
        comingSoon: false,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceChains: [BridgeKey.ETHEREUM],
        destinationChains: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.MRPH],
        description:
          'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      },
      [BridgeKey.SEI]: {
        name: 'Sei',
        comingSoon: true,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceChains: [BridgeKey.ETHEREUM],
        destinationChains: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.SEI],
        description:
          'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
      },
    },
    markets: {
      [MarketKey.WEETH_WSTETH]: {
        id: 0,
        key: MarketKey.WEETH_WSTETH,
        collateralAsset: TokenKey.WEETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x0000000000eaEbd95dAfcA37A39fd09745739b78',
          reserveOracle: '0x78C3ac7F84F5101422DCd89fB387bD0DeEf8d662',
        },
      },
      [MarketKey.RSETH_WSTETH]: {
        id: 1,
        key: MarketKey.RSETH_WSTETH,
        collateralAsset: TokenKey.RSETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x0000000000E33e35EE6052fae87bfcFac61b1da9',
          reserveOracle: '0x095FE689AFC3e57bb32Bc06Fd45aD2382f47e2fd',
        },
      },
      [MarketKey.RSWETH_WSTETH]: {
        id: 2,
        key: MarketKey.RSWETH_WSTETH,
        collateralAsset: TokenKey.RSWETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x00000000007C8105548f9d0eE081987378a6bE93',
          reserveOracle: '0xAAa88236D483f08003493adbbf451373992f2f58',
        },
      },
      [MarketKey.EZETH_WETH]: {
        id: 3,
        key: MarketKey.EZETH_WETH,
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
  // Tenderly Mainnet
  ////////////////////////////////////////

  [ChainKey.TENDERLY_MAINNET]: {
    id: 99099127,
    name: 'Ion Testnet',
    contracts: {
      chainlink: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      ionLens: '0xe89AF12af000C4f76a57A3aD16ef8277a727DC81',
    },
    bridges: {
      [BridgeKey.MORPH]: {
        name: 'Morph',
        comingSoon: false,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceChains: [BridgeKey.ETHEREUM],
        destinationChains: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.MRPH],
        description:
          'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      },
      [BridgeKey.SEI]: {
        name: 'Sei',
        comingSoon: true,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceChains: [BridgeKey.ETHEREUM],
        destinationChains: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.SEI],
        description:
          'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
      },
    },
    markets: {
      [MarketKey.WEETH_WSTETH]: {
        id: 0,
        key: MarketKey.WEETH_WSTETH,
        collateralAsset: TokenKey.WEETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x0000000000eaEbd95dAfcA37A39fd09745739b78',
          reserveOracle: '0x78C3ac7F84F5101422DCd89fB387bD0DeEf8d662',
        },
      },
      [MarketKey.RSETH_WSTETH]: {
        id: 1,
        key: MarketKey.RSETH_WSTETH,
        collateralAsset: TokenKey.RSETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x0000000000E33e35EE6052fae87bfcFac61b1da9',
          reserveOracle: '0x095FE689AFC3e57bb32Bc06Fd45aD2382f47e2fd',
        },
      },
      [MarketKey.RSWETH_WSTETH]: {
        id: 2,
        key: MarketKey.RSWETH_WSTETH,
        collateralAsset: TokenKey.RSWETH,
        lenderAsset: TokenKey.WSTETH,
        contracts: {
          ionPool: '0x00000000007C8105548f9d0eE081987378a6bE93',
          reserveOracle: '0xAAa88236D483f08003493adbbf451373992f2f58',
        },
      },
      [MarketKey.EZETH_WETH]: {
        id: 3,
        key: MarketKey.EZETH_WETH,
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
  // Sepolia
  ////////////////////////////////////////

  [ChainKey.SEPOLIA]: {
    id: 11155111,
    name: 'Sepolia',
    contracts: {
      chainlink: '0xceA6Aa74E6A86a7f85B571Ce1C34f1A60B77CD29',
      ionLens: '0x0',
    },
    bridges: {
      [BridgeKey.OPTIMISM]: {
        name: 'Optimism',
        comingSoon: false,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x28bdf277598d9f4dc0df2d16764764695cb3bbec',
          boringVault: '0x262031e2f50b8faea37b09445ad941e6256f1919',
        },
        sourceChains: [BridgeKey.ETHEREUM],
        destinationChains: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.MRPH],
        description: 'TBD',
      },
    },
    markets: {},
  },
}
