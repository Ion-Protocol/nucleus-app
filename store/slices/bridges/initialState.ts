import { BridgeKey, ChainKey } from '@/config/bridges'
import { TokenKey } from '@/config/token'

export interface AsyncMetric {
  value: string | number
  loading: boolean
}

export interface BridgeData {
  tvl: AsyncMetric
  apy: AsyncMetric
  rate: AsyncMetric
  error: string | null
  from: string
  selectedFromToken: TokenKey | null
  selectedToToken: TokenKey | null
}

export type BridgesState = {
  data: { [bridgeKey in BridgeKey]: BridgeData } | null
  overallLoading: boolean
  sourceChain: ChainKey
  inputError: string | null
  destinationChain: ChainKey
  deposit: {
    pending: boolean
    error: string | null
  }
}

export const initialState: BridgesState = {
  data: null,
  overallLoading: true,
  sourceChain: ChainKey.MAINNET,
  destinationChain: ChainKey.MAINNET,
  inputError: null,
  deposit: {
    pending: false,
    error: null,
  },
}
