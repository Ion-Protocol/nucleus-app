import { BridgeKey } from '@/config/bridges'
import { UIDataObject } from './common'

export interface Bridge {
  name: string
  description: string
}

export interface BridgeUI extends Bridge {
  key: BridgeKey
  tvl: UIDataObject
  apy: UIDataObject
}
