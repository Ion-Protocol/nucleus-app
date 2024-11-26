import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'
import { PointSystem } from './PointSystem'
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
  isExternal?: boolean
  partnerUrl?: string
  manuallyPaused?: boolean
  sourceChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
  defaultRedemptionChain: ChainKey
  sourceRedemptionChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
  redemptionChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
  contracts: Contracts
  layerZeroChainSelector?: number
  sourceTokens: Partial<{
    [chain in ChainKey]: TokenKey[]
  }>
  wantTokens: Partial<{
    [chain in ChainKey]: TokenKey[]
  }>
  receiveOn: ChainKey
  points: PointSystem[]
  apys: Partial<Record<TokenKey, TokenApyDataItem[]>>
  showRewardsAndHistory?: boolean
  redeem: {
    redemptionSourceChain: ChainKey
    redemptionSourceChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
    redemptionSourceAsset: TokenKey
    redemptionDestinationChain: ChainKey
    redemptionDestinationChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
    withdrawalChain: ChainKey
    layerZeroChainSelector: number
    wantTokens: Partial<Record<ChainKey, TokenKey[]>>
  }
}

export type NetworkAssets = Partial<Record<TokenKey, NetworkAsset>>
