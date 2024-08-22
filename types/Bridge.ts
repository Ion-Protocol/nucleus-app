import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'

export interface Bridge {
  name: string
  chainId: number
  layerZeroChainSelector: number
  description: string
  sourceBridges: BridgeKey[]
  contracts: Contracts
  sourceTokens: Partial<{
    [bridge in BridgeKey]: TokenKey[]
  }>
  nativeToken: TokenKey
  comingSoon?: boolean
  feeToken: TokenKey
}
