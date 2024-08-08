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

export interface ChainConfig {
  id: number
  name: string
  bridges: Partial<Record<BridgeKey, Bridge>>
}

export const chainsConfig: Record<ChainKey, ChainConfig> = {
  ////////////////////////////////////////
  // Mainnet
  ////////////////////////////////////////

  [ChainKey.MAINNET]: {
    id: 1,
    name: 'Ethereum',
    bridges: {
      [BridgeKey.MORPH]: {
        name: 'Morph',
        chainId: 2710,
        comingSoon: false,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceBridges: [BridgeKey.ETHEREUM],
        destinationBridges: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.MRPH],
        layerZeroChainSelector: 0,
        description:
          'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      },
      [BridgeKey.SEI]: {
        name: 'Sei',
        chainId: 1329,
        comingSoon: true,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceBridges: [BridgeKey.ETHEREUM],
        destinationBridges: [BridgeKey.ETHEREUM, BridgeKey.SEI],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.SEI],
        layerZeroChainSelector: 0,
        description:
          'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
      },
    },
  },

  ////////////////////////////////////////
  // Tenderly Mainnet
  ////////////////////////////////////////

  [ChainKey.TENDERLY_MAINNET]: {
    id: 99099127,
    name: 'Ion Testnet',
    bridges: {
      [BridgeKey.MORPH]: {
        name: 'Morph',
        chainId: 2710,
        comingSoon: false,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceBridges: [BridgeKey.ETHEREUM],
        destinationBridges: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.MRPH],
        layerZeroChainSelector: 0,
        description:
          'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      },
      [BridgeKey.SEI]: {
        name: 'Sei',
        chainId: 1329,
        comingSoon: true,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceBridges: [BridgeKey.ETHEREUM],
        destinationBridges: [BridgeKey.ETHEREUM, BridgeKey.SEI],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.SEI],
        layerZeroChainSelector: 0,
        description:
          'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
      },
    },
  },

  ////////////////////////////////////////
  // Sepolia
  ////////////////////////////////////////

  [ChainKey.SEPOLIA]: {
    id: 11155111,
    name: 'Sepolia',
    bridges: {
      [BridgeKey.OPTIMISM]: {
        name: 'Optimism',
        chainId: 10,
        layerZeroChainSelector: 40232,
        comingSoon: false,
        contracts: {
          teller: '0xffea4fb47ac7fa102648770304605920ce35660c',
          accountant: '0x28bdf277598d9f4dc0df2d16764764695cb3bbec',
          boringVault: '0x262031e2f50b8faea37b09445ad941e6256f1919',
        },
        sourceBridges: [BridgeKey.ETHEREUM],
        destinationBridges: [BridgeKey.ETHEREUM, BridgeKey.OPTIMISM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.WETH, TokenKey.WSTETH],
        description: 'TBD',
      },
    },
  },
}
