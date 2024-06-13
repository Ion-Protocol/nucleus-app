import { BridgeKey } from '@/config/bridges'
import { UIDataObject } from './common'
import { ChainKey } from '@/config/chains'

export interface Bridge {
  name: string
  description: string
  sourceChains: ChainKey[]
  destinationChains: ChainKey[]
}

export interface BridgeUI extends Bridge {
  key: BridgeKey
  tvl: UIDataObject
  apy: UIDataObject
}
