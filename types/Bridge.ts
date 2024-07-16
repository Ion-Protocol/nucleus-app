import { BridgeKey } from '@/config/bridges'
import { TokenKey } from '@/config/token'
import { UIDataObject } from './common'
import { Contracts } from './Contracts'

export interface Bridge {
  name: string
  description: string
  sourceChains: BridgeKey[]
  destinationChains: BridgeKey[]
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
