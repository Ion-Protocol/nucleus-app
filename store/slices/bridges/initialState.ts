import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { ChainKey } from '@/config/chains'
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
  sourceChain: ChainKey
  inputError: string | null
  destinationChain: ChainKey
  deposit: {
    pending: boolean
    error: string | null
  }
}

// Initialize the data object by iterating over all the bridge keys and setting the initial state
const initializeData = (): { [key in BridgeKey]: BridgeData } => {
  const data: { [key in BridgeKey]: BridgeData } = {} as any

  Object.values(BridgeKey).forEach((key) => {
    data[key] = {
      tvl: { value: BigInt(0).toString(), loading: false },
      apy: { value: BigInt(0).toString(), loading: false },
      rate: { value: BigInt(0).toString(), loading: false },
      error: null,
      from: '',
      selectedFromToken: bridgesConfig[key].sourceTokens[0],
      selectedToToken: bridgesConfig[key].destinationTokens[0],
    }
  })

  return data
}

export const initialState: BridgesState = {
  data: initializeData(),
  overallLoading: true,
  sourceChain: ChainKey.ETHEREUM,
  destinationChain: ChainKey.ETHEREUM,
  inputError: null,
  deposit: {
    pending: false,
    error: null,
  },
}
