import { Bridge } from '@/types/Bridge'
import { ChainKey } from './chains'
import { TokenKey } from './token'

// Use kebab-case (with hyphens) for the values.
// These values are used to define the url paths.
export enum BridgeKey {
  ARBITRUM = 'arbitrum',
  SWELL = 'swell',
  EDGELESS = 'edgeless',
  OPTIMISM = 'optimism',
  BOBA_NETWORK = 'boba-network',
  SEI = 'sei',
}

/**
 * Steps to add a new L2:
 * 1. Add a new key to the BridgeKey enum. Be sure to use kebab-case for the value.
 * 2. Add a new entry to the bridgesConfig object.
 * 3. Add the svg to the public/assets/svgs folder.
 * 4. Run `npm run convert-icons` to generate a new Chakra icon for the new svg. You can also add it manually.
 * 5. Add the L2 to the BridgeIconMap in the YieldBridgeIcon component.
 */
export const bridgesConfig: Record<BridgeKey, Bridge> = {
  [BridgeKey.ARBITRUM]: {
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
    name: 'Arbitrum',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
    },
    sourceChains: [ChainKey.ETHEREUM, ChainKey.TEST],
    destinationChains: [ChainKey.ETHEREUM],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.SWELL]: {
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
    name: 'Swell',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.EDGELESS]: {
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
    name: 'Edgeless',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.OPTIMISM]: {
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
    name: 'Optimism',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.BOBA_NETWORK]: {
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
    name: 'Boba Network',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.SEI]: {
    availableTokens: [TokenKey.ETH, TokenKey.WETH, TokenKey.WSTETH],
    name: 'Sei',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
}
