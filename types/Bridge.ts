import { UIDataObject } from './common'

// Use kebab-case (with hyphens) for the values.
// These values are used to define the url paths.
export enum BridgeKey {
  ARBITRUM = 'arbitrum',
  SWELL = 'swell',
  EDGELESS = 'edgeless',
  OPTIMISM = 'optimism',
  BOBA_NETWORK = 'boba-network',
}

export interface Bridge {
  name: string
  description: string
}

export interface BridgeUI extends Bridge {
  key: BridgeKey
  tvl: UIDataObject
  apy: UIDataObject
}
