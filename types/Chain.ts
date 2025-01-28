import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Contracts } from './Contracts'
import { PointSystem } from './PointSystem'
import { Token } from './Token'

export interface TokenApyDataItem {
  distribution: number // Token distribution within the time range in USD
  endDate: number
  startDate: number
  tokenKey: TokenKey
}

export interface NetworkAsset {
  apys: Partial<Record<TokenKey, TokenApyDataItem[]>>
  chain: ChainKey
  comingSoon?: boolean
  contracts: Contracts
  defaultMintChain: ChainKey
  defaultRedemptionChain: ChainKey
  deployedOn: ChainKey
  description: string
  isExternal?: boolean
  isNewDeployment?: boolean
  hyperlaneChainSelector?: number
  layerZeroChainSelector?: number
  manuallyPaused?: boolean
  nativeCurrency?: Token
  partnerUrl?: string
  points: PointSystem[]
  redeem: {
    hyperlaneChainSelector?: number
    layerZeroChainSelector?: number
    redemptionDestinationChain: ChainKey
    redemptionDestinationChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
    redemptionSourceAsset: TokenKey
    redemptionSourceChain: ChainKey
    redemptionSourceChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
    wantTokens: Partial<Record<ChainKey, Partial<Record<TokenKey, { token: Token; withdrawalFee: number }>>>>
    withdrawalChain: ChainKey
    withdrawalFee: number
  }
  receiveOn: ChainKey
  redeemComingSoon?: boolean
  showRewardsAndHistory?: boolean
  sourceChains: Partial<Record<ChainKey, { chain: ChainKey; explorerBaseUrl: string }>>
  sourceTokens: Partial<{
    [chain in ChainKey]: TokenKey[]
  }>
  token: Token
  protocols: ChainKey[]
}

export type NetworkAssets = Partial<Record<TokenKey, NetworkAsset>>
