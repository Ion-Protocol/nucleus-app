import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'

export interface AsyncMetric {
  value: string | number | null
  loading: boolean
}

export interface ChainData {
  tvl: AsyncMetric
  error: string | null
}

export type BridgesState = {
  data: { [chainKey in ChainKey]: ChainData }
  overallLoading: boolean
  depositAmount: string
  selectedSourceToken: TokenKey | null
  tvlLoading: boolean
  previewFeeLoading: boolean
  tokenRateInQuote: string | null
  tokenRateInQuoteLoading: boolean
  previewFee: string | null
  sourceChain: ChainKey
  destinationChain: ChainKey | null
  deposit: {
    pending: boolean
    error: string | null
  }
}

const initialChainData: ChainData = {
  tvl: { value: null, loading: false },
  error: null,
}

export const initialState: BridgesState = {
  data: Object.values(ChainKey).reduce(
    (acc, key) => {
      acc[key as ChainKey] = { ...initialChainData }
      return acc
    },
    {} as { [chainKey in ChainKey]: ChainData }
  ),
  overallLoading: false,
  depositAmount: '',
  selectedSourceToken: null,
  tokenRateInQuote: null,
  tokenRateInQuoteLoading: false,
  tvlLoading: false,
  previewFeeLoading: false,
  previewFee: null,
  sourceChain: ChainKey.ETHEREUM,
  destinationChain: ChainKey.ETHEREUM,
  deposit: {
    pending: false,
    error: null,
  },
}
