import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'

// A type that includes a loading state to be used for data that is loaded from
// the contracts
type AsyncMetric<T> = {
  data: T
  loading: boolean
  error?: string | null
}

// Rules for storing values in global state.
// If one of these rules applies to your value, then storing in global state is justified.
// 1. The value is read asynchronously from the contracts
// 2. The value is used in a thunk
// 3. The value is used in multiple components
// 4. The value is set in multiple ways

// Rules do not need to be strictly adhered to, but do try to keep unneeded values out of the global state.
// When adding a value to the store, please add the justification for doing so.
// Feel free to add to the ruleset above if your justification is not included.

export type NetworkAssetsState = {
  // TVL represents Total Value Locked for the token asset.
  // The TVL is stored as a mapping of chain keys to tvl values since TVL's for
  // every asset need to be diplayed on the dashboard simultaneously.
  // The TVL is also displayed at the top of each token page.
  // ---
  // Justification for storing in global state:
  // 1. The value is read asynchronously from the contracts
  // 2. The value is used in multiple components
  tvl: AsyncMetric<{ [tokenKey in TokenKey]: string }>

  // Preview Fee is the bridge fee that will be paid on the depositAndBridge
  // function. This only applies when bridging from L1 to L2.
  // ---
  // Justification for storing in global state:
  // 1. The preview fee is read asynchronously from the contracts
  // 2. The value is used in a thunk
  previewFee: AsyncMetric<string | null>

  // The token rate is the exchange rate (ETH / share) of the token. This is used to calc
  // ---
  // Justification for storing in global state:
  // 1. The value is read asynchronously from the contracts
  // 2. The value is used in multiple components
  // 3. The value is used in a thunk
  tokenRate: AsyncMetric<string | null>

  // The source chain is the chain that the user selects in the drop down menu on the token page
  // ---
  // Justification for storing in global state:
  // 1. The value is used in multiple components
  // 2. The value is used in a thunk
  sourceChain: ChainKey

  // The deposit amount is the number that is input by the user in the input field on the token page
  // ---
  // Justification for storing in global state:
  // 1. The value is used in multiple components
  // 2. The value is set in multiple ways
  // 3. The value is used in a thunk
  depositAmount: string

  // The selected source token is the token that the user has selected in the token drop down on the token page
  // ---
  // Justification for storing in global state:
  // 1. The value is used in multiple components
  selectedSourceToken: TokenKey | null

  // The deposit object is used to track the status of the deposit transaction
  // ---
  // Justification for storing in global state:
  // 1. The value is used in a thunk
  deposit: {
    pending: boolean
    error: string | null
  }
}

export const initialState: NetworkAssetsState = {
  // TVL
  tvl: {
    data: Object.values(TokenKey).reduce(
      (acc, key) => {
        acc[key as TokenKey] = ''
        return acc
      },
      {} as { [tokenKey in TokenKey]: '' }
    ),
    loading: false,
  },

  // Preview Fee
  previewFee: {
    data: null,
    loading: false,
  },

  // Token Rate
  tokenRate: {
    data: null,
    loading: false,
  },

  // Source chain
  sourceChain: ChainKey.ETHEREUM,

  // Deposit amount
  depositAmount: '',

  // Selected source token
  selectedSourceToken: null,

  // Deposit
  deposit: {
    pending: false,
    error: null,
  },
}
