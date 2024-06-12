import { Bridge, BridgeKey } from '@/types/Bridge'

export const bridgesConfig: Record<BridgeKey, Bridge> = {
  [BridgeKey.ARBITRUM]: {
    name: 'Arbitrum',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.SWELL]: {
    name: 'Swell',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.EDGELESS]: {
    name: 'Edgeless',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.OPTIMISM]: {
    name: 'Optimism',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
  [BridgeKey.BOBA_NETWORK]: {
    name: 'Boba Network',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
}
