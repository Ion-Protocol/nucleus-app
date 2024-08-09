import { BridgeKey } from '@/config/chains'
import { TokenKey } from '@/config/token'
import { Contracts } from './Contracts'

export interface Bridge {
  name: string
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
