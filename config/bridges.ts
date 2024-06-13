import { Bridge } from '@/types/Bridge'
import { ChainKey } from './chains'

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
    name: 'Arbitrum',
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.SWELL]: {
    name: 'Swell',
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.EDGELESS]: {
    name: 'Edgeless',
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.OPTIMISM]: {
    name: 'Optimism',
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.BOBA_NETWORK]: {
    name: 'Boba Network',
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.SEI]: {
    name: 'Sei',
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
}
