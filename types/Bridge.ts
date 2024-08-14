import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'

export interface Bridge {
  name: string
  chainId: number
  deployedOn: number // The chainId that the bridge contracts are deployed on
  layerZeroChainSelector: number
  description: string
  sourceBridges: BridgeKey[]
  destinationBridges: BridgeKey[]
  contracts: Contracts
  sourceTokens: TokenKey[]
  destinationTokens: TokenKey[]
  nativeToken: TokenKey
  comingSoon?: boolean
}
