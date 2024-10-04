import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'
import { PointSystem, PointSystemKey } from './PointSystem'
import { Token } from './Token'

export interface TokenApyDataItem {
  tokenKey: TokenKey
  startDate: number
  endDate: number
  distribution: number // Token distribution within the time range in USD
}

export interface NetworkAsset {
  token: Token
  description: string
  chain: ChainKey
  deployedOn: ChainKey
  comingSoon?: boolean
  manuallyPaused?: boolean
  sourceChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
  contracts: Contracts
  layerZeroChainSelector?: number
  sourceTokens: Partial<{
    [chain in ChainKey]: TokenKey[]
  }>
  receiveOn: ChainKey
  points: PointSystem[]
  apys: Partial<Record<TokenKey, TokenApyDataItem[]>>
}

export type NetworkAssets = Partial<Record<TokenKey, NetworkAsset>>
