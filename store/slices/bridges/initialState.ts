import { BridgeKey, ChainKey } from '@/config/chains'
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
  data: { [bridgeKey in BridgeKey]: BridgeData }
  overallLoading: boolean
  tvlLoading: boolean
  sourceChain: ChainKey
  inputError: string | null
  destinationChain: ChainKey
  deposit: {
    pending: boolean
    error: string | null
  }
}

const initialBridgeData: BridgeData = {
  tvl: { value: 0, loading: true },
  apy: { value: 0, loading: true },
  rate: { value: 0, loading: true },
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
  overallLoading: true,
  tvlLoading: true,
  sourceChain: ChainKey.MAINNET,
  destinationChain: ChainKey.MAINNET,
  inputError: null,
  deposit: {
    pending: false,
    error: null,
  },
}
