import { BridgeKey, ChainKey } from '@/config/chains'
import { TokenKey } from '@/config/token'

export interface AsyncMetric {
  value: string | number | null
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
  data: { [bridgeKey in BridgeKey]: BridgeData }
  overallLoading: boolean
  tvlLoading: boolean
  apyLoading: boolean
  previewFeeLoading: boolean
  previewFee: string | null
  sourceBridge: BridgeKey | null
  inputError: string | null
  destinationBridge: BridgeKey | null
  deposit: {
    pending: boolean
    error: string | null
  }
}

const initialBridgeData: BridgeData = {
  tvl: { value: null, loading: false },
  apy: { value: null, loading: false },
  rate: { value: null, loading: false },
  error: null,
  from: '',
  selectedFromToken: null,
  selectedToToken: null,
}

export const initialState: BridgesState = {
  data: Object.values(BridgeKey).reduce(
    (acc, key) => {
      acc[key as BridgeKey] = { ...initialBridgeData }
      return acc
    },
    {} as { [bridgeKey in BridgeKey]: BridgeData }
  ),
  overallLoading: false,
  tvlLoading: false,
  apyLoading: false,
  previewFeeLoading: false,
  previewFee: null,
  sourceBridge: BridgeKey.ETHEREUM,
  destinationBridge: BridgeKey.ETHEREUM,
  inputError: null,
  deposit: {
    pending: false,
    error: null,
  },
}
