import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'
import { PointSystemKey } from './PointSystem'

interface IncentiveSystem {
  chainKey: ChainKey
  name: string
  rewardPercentage: number
}

interface PointSystem {
  pointSystemKey: PointSystemKey
  name: string
  multiplier: number
}

export interface TokenApyDataItem {
  startDate: number
  endDate: number
  distribution: number // Token distribution within the time range in USD
}

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
  comingSoon?: boolean
  feeToken: TokenKey
  receiveOn: ChainKey
  yieldAsset: TokenKey
  points: PointSystem[]
  tokenApyData: Partial<Record<TokenKey, TokenApyDataItem[]>>
}
