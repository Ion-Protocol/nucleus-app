import { Bridge, BridgeKey } from '@/types/Bridge'

export const bridgesConfig: Record<BridgeKey, Bridge> = {
  [BridgeKey.ARBITRUM]: {
    name: 'Arbitrum',
  },
  [BridgeKey.SWELL]: {
    name: 'Swell',
  },
  [BridgeKey.EDGELESS]: {
    name: 'Edgeless',
  },
}
