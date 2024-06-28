import { Bridge } from '@/types/Bridge'
import { ChainKey } from './chains'
import { TokenKey } from './token'

// Use kebab-case (with hyphens) for the values.
// These values are used to define the url paths.
export enum BridgeKey {
  SEI = 'sei',
  MORPH = 'morph',
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
  [BridgeKey.MORPH]: {
    name: 'Morph',
    comingSoon: false,
    contracts: {
      teller: '0x0000000000F45660Bb8Fc3F86da8854c63cF49e3',
      accountant: '0x00000000004F96C07B83e86600D86F9479bB43fa',
      boringVault: '0x0000000000E7Ab44153eEBEF2343ba5289F65dAC',
    },
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
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
    sourceChains: [ChainKey.ETHEREUM],
    destinationChains: [ChainKey.ETHEREUM],
    sourceTokens: [TokenKey.WETH, TokenKey.WSTETH],
    destinationTokens: [TokenKey.SEI],
    description:
      'Sei is the first parallelized EVM. This allows Sei to get the best of Solana and Ethereum - a hyper optimized execution layer that benefits from the tooling and mindshare around the EVM.',
  },
}
