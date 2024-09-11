import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'
import { PointSystemKey } from './PointSystem'

interface IncentiveSystem {
  chainKey: ChainKey
  rewardPercentage: number
}

interface PointSystem {
  pointSystemKey: PointSystemKey
  multiplier: number
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
  incentives: IncentiveSystem[]
  points: PointSystem[]
}
