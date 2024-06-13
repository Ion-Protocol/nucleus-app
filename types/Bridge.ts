import { BridgeKey } from '@/config/bridges'
import { ChainKey } from '@/config/chains'
import { TokenKey } from '@/config/token'
import { UIDataObject } from './common'
import { Contracts } from './Contracts'

export interface Bridge {
  name: string
  description: string
  sourceChains: ChainKey[]
  destinationChains: ChainKey[]
  availableTokens: TokenKey[]
  contracts: Contracts
}

export interface BridgeUI extends Bridge {
  key: BridgeKey
  tvl: UIDataObject
  apy: UIDataObject
}
