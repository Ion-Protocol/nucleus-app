import { BridgeKey } from '@/config/chains'
import { TokenKey } from '@/config/token'
import { Contracts } from './Contracts'

export interface Bridge {
  name: string
  chainId: number
  layerZeroChainSelector: number
  description: string
  sourceBridges: BridgeKey[]
  destinationBridges: BridgeKey[]
  contracts: Contracts
  sourceTokens: TokenKey[]
  destinationTokens: TokenKey[]
  comingSoon?: boolean
}
