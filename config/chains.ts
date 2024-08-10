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
  BOBA = 'boba',
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
      [BridgeKey.SEI]: {
        name: 'Sei',
        deployedOn: 1,
        comingSoon: false,
        contracts: {
          teller: '0xB52C7d88F0514796877B04cF945E56cC4C66CD05',
          accountant: '0x24152894Decc7384b05E8907D6aDAdD82c176499',
          boringVault: '0x9fAaEA2CDd810b21594E54309DC847842Ae301Ce',
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
      [BridgeKey.BOBA]: {
        name: 'Boba',
        deployedOn: 1,
        comingSoon: false,
        contracts: {
          teller: '0x690a032B33d4d016bE5d41B00eB06814e167c525',
          accountant: '0x78cba912751dB70CBd77C1111A4d1aDD077AD99A',
          boringVault: '0x52E4d8989fa8b3E1C06696e7b16DEf5d7707A0d1',
        },
        sourceBridges: [BridgeKey.ETHEREUM, BridgeKey.BOBA],
        destinationBridges: [BridgeKey.ETHEREUM],
        sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
        destinationTokens: [TokenKey.BOBA],
        nativeToken: TokenKey.BOBA,
        layerZeroChainSelector: 0,
        description: 'WIP',
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
