import { Bridge } from '@/types/Bridge'
import { ChainKey } from './chains'
import { TokenKey } from './token'

// Use kebab-case (with hyphens) for the values.
// These values are used to define the url paths.
export enum BridgeKey {
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
  [BridgeKey.SEI]: {
    name: 'Sei',
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
      accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
      boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    acceptedTokens: [TokenKey.WETH, TokenKey.WSTETH],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
}
