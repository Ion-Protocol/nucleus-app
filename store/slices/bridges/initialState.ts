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
  previewFee: number | null
}

export type BridgesState = {
  data: { [bridgeKey in BridgeKey]: BridgeData }
  overallLoading: boolean
  tvlLoading: boolean
  apyLoading: boolean
  sourceBridge: BridgeKey | null
  inputError: string | null
  destinationBridge: BridgeKey | null
  deposit: {
    pending: boolean
    error: string | null
  }
}

const initialBridgeData: BridgeData = {
  tvl: { value: 0, loading: false },
  apy: { value: null, loading: false },
  rate: { value: 0, loading: false },
  error: null,
  from: '',
  selectedFromToken: null,
  selectedToToken: null,
  previewFee: null,
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
  sourceBridge: null,
  destinationBridge: null,
  inputError: null,
  deposit: {
    pending: false,
    error: null,
  },
}
