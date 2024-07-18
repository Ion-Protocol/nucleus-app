import { TokenKey } from '@/config/token'
import { UIDataObject } from './common'
import { Contracts } from './Contracts'
import { BridgeKey } from '@/config/chains'

export interface Bridge {
  name: string
  description: string
  sourceBridges: BridgeKey[]
  destinationBridges: BridgeKey[]
  contracts: Contracts
  sourceTokens: TokenKey[]
  destinationTokens: TokenKey[]
  comingSoon?: boolean
}

export interface BridgeUI extends Bridge {
  key: BridgeKey
  tvl: UIDataObject
  apy: UIDataObject
}
