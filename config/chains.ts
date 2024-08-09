import { Bridge } from '@/types/Bridge'
import { TokenKey } from './token'

export enum ChainKey {
  MAINNET = 'mainnet',
  TENDERLY_MAINNET = 'tenderly_mainnet',
  SEPOLIA = 'sepolia',
}

// Use kebab-case (with hyphens) for the values.
// These values are used to define the url paths.
export enum BridgeKey {
  ETHEREUM = 'ethereum',
  SEI = 'sei',
  MORPH = 'morph',
  OPTIMISM_SEPOLIA_LAYER_ZERO = 'optimism_sepolia_layer_zero',
  OPTIMISM_SEPOLIA_OPSTACK = 'optimism_sepolia_opstack',
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
        deployedOn: 1,
        comingSoon: false,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.MRPH],
        nativeToken: TokenKey.MRPH,
        layerZeroChainSelector: 0,
        description:
          'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      },
      [BridgeKey.SEI]: {
        name: 'Sei',
        deployedOn: 1,
        comingSoon: true,
        contracts: {
          teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
          accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
          boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.SEI],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.SEI],
        nativeToken: TokenKey.SEI,
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
      // [BridgeKey.MORPH]: {
      //   name: 'Morph',
      //   deployedOn: 99099127, // tenderly chain id
      //   comingSoon: false,
      //   contracts: {
      //     teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
      //     accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
      //     boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
      //   },
      //   sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
      //   destinationBridges: [BridgeKey.ETHEREUM],
      //   sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
      //   destinationTokens: [TokenKey.MRPH],
      //   layerZeroChainSelector: 0,
      //   description:
      //     'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      // },
      // [BridgeKey.SEI]: {
      //   name: 'Sei',
      //   deployedOn: 99099127, // tenderly chain id
      //   comingSoon: true,
      //   contracts: {
      //     teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
      //     accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
      //     boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
      //   },
      //   sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.SEI],
      //   destinationBridges: [BridgeKey.ETHEREUM],
      //   sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
      //   destinationTokens: [TokenKey.SEI],
      //   layerZeroChainSelector: 0,
      //   description:
      //     'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
      // },
      [BridgeKey.OPTIMISM_SEPOLIA_LAYER_ZERO]: {
        name: 'Optimism Sepolia (LayerZero)',
        deployedOn: 11155111, // Sepolia chain id
        layerZeroChainSelector: 40232,
        comingSoon: false,
        contracts: {
          teller: '0xffea4fb47ac7fa102648770304605920ce35660c',
          accountant: '0x28bdf277598d9f4dc0df2d16764764695cb3bbec',
          boringVault: '0x262031e2f50b8faea37b09445ad941e6256f1919',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.OPTIMISM_SEPOLIA_LAYER_ZERO],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.OP],
        nativeToken: TokenKey.OP,
        description: 'TBD',
      },
      [BridgeKey.OPTIMISM_SEPOLIA_OPSTACK]: {
        name: 'Optimism Sepolia (OPStack)',
        deployedOn: 11155111, // Sepolia chain id
        layerZeroChainSelector: 0,
        comingSoon: false,
        contracts: {
          teller: '0x8d9d36a33dad6fb622180b549ab05b6ed71350f7',
          accountant: '0x21682dc809db2030952d98c253b9121c82e073ec',
          boringVault: '0x902d4c9f2c0693bf94d3f0777a4e84aef5bb2046',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.OPTIMISM_SEPOLIA_OPSTACK],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.OP],
        nativeToken: TokenKey.OP,
        description: 'TBD',
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
      // [BridgeKey.MORPH]: {
      //   name: 'Morph',
      //   deployedOn: 99099127, // tenderly chain id
      //   comingSoon: false,
      //   contracts: {
      //     teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
      //     accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
      //     boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
      //   },
      //   sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.MORPH],
      //   destinationBridges: [BridgeKey.ETHEREUM],
      //   sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
      //   destinationTokens: [TokenKey.MRPH],
      //   layerZeroChainSelector: 0,
      //   description:
      //     'Morph provides the tools and infrastructure necessary for developers to create decentralized applications (DApps) that are not only powerful but also intuitive and easy to use for the everyday consumer.',
      // },
      // [BridgeKey.SEI]: {
      //   name: 'Sei',
      //   deployedOn: 99099127, // tenderly chain id
      //   comingSoon: true,
      //   contracts: {
      //     teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
      //     accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
      //     boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
      //   },
      //   sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.SEI],
      //   destinationBridges: [BridgeKey.ETHEREUM],
      //   sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
      //   destinationTokens: [TokenKey.SEI],
      //   layerZeroChainSelector: 0,
      //   description:
      //     'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
      // },
      [BridgeKey.OPTIMISM_SEPOLIA_LAYER_ZERO]: {
        name: 'Optimism Sepolia (LayerZero)',
        deployedOn: 11155111, // Sepolia chain id
        layerZeroChainSelector: 40232,
        comingSoon: false,
        contracts: {
          teller: '0xffea4fb47ac7fa102648770304605920ce35660c',
          accountant: '0x28bdf277598d9f4dc0df2d16764764695cb3bbec',
          boringVault: '0x262031e2f50b8faea37b09445ad941e6256f1919',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.OPTIMISM_SEPOLIA_LAYER_ZERO],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.OP],
        nativeToken: TokenKey.OP,
        description: 'TBD',
      },
      [BridgeKey.OPTIMISM_SEPOLIA_OPSTACK]: {
        name: 'Optimism Sepolia (OPStack)',
        deployedOn: 11155111, // Sepolia chain id
        layerZeroChainSelector: 0,
        comingSoon: false,
        contracts: {
          teller: '0x8d9d36a33dad6fb622180b549ab05b6ed71350f7',
          accountant: '0x21682dc809db2030952d98c253b9121c82e073ec',
          boringVault: '0x902d4c9f2c0693bf94d3f0777a4e84aef5bb2046',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.OPTIMISM_SEPOLIA_OPSTACK],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.OP],
        nativeToken: TokenKey.OP,
        description: 'TBD',
      },
    },
  },
}
