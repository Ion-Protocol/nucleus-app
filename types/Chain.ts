import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'

export interface Chain {
  name: string
  chainId: number
  layerZeroChainSelector?: number
  description: string
  sourceChains: ChainKey[]
  contracts: Contracts
  sourceTokens: Partial<{
    [chain in ChainKey]: TokenKey[]
  }>
  nativeToken: TokenKey
  networkSymbol: string
  comingSoon?: boolean
  feeToken: TokenKey
  receiveOn: ChainKey
  yieldAsset: TokenKey
}
