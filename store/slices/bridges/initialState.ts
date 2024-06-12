import { BridgeKey } from '@/types/Bridge'

export interface BridgeMetric {
  value: string
  loading: boolean
}

export interface BridgeData {
  tvl: BridgeMetric
  apy: BridgeMetric
  error: string | null
}

export type BridgesState = {
  data: { [bridgeKey in BridgeKey]: BridgeData }
  overallLoading: boolean
}

export const initialState: BridgesState = {
  data: {
    [BridgeKey.ARBITRUM]: {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      error: null,
    },
    [BridgeKey.EDGELESS]: {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      error: null,
    },
    [BridgeKey.SWELL]: {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      error: null,
    },
    [BridgeKey.OPTIMISM]: {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      error: null,
    },
    [BridgeKey.BOBA_NETWORK]: {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      error: null,
    },
  },
  overallLoading: true,
}
