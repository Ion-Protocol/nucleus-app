import { balanceOf } from '@/api/contracts/erc20/balanceOf'
import { getSolanaBalance } from '@/api/utils/getSolanaBalance'
import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/tokens'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getBalance } from 'wagmi/actions'
import { selectAddress } from '../account'
import { selectSolanaAddress } from '../networkAssets'
import { setErrorMessage } from '../status'

type Balances = Record<TokenKey, Record<ChainKey, string | null>>
export interface fetchAllTokenBalancesResult {
  balances: Balances
  options?: { ignoreLoading?: boolean }
}

/**
 * Async thunk to fetch the balances of all tokens for the current user's address.
 *
 * This function retrieves the user's address from the state, and then concurrently fetches the
 * balance for each token defined in the tokensConfig. If successful, it returns an object
 * containing all token balances. If an error occurs, it logs the error, dispatches it to the error
 * slice, and rejects the thunk with an error message.
 *
 * @returns {Promise<fetchAllTokenBalancesResult>} - An object containing the balances of all tokens.
 *
 * @throws {string} - An error message indicating the failure to fetch token balances.
 */
export const fetchAllTokenBalances = createAsyncThunk<
  fetchAllTokenBalancesResult,
  { solanaAddressFromAction?: string; ignoreLoading?: boolean } | undefined,
  { rejectValue: string; state: RootState }
>(
  'balances/fetchAllTokenBalances',
  async (options, { getState, rejectWithValue, dispatch }) => {
    const state = getState()

    const address = selectAddress(state)
    const solanaAddress = options?.solanaAddressFromAction || selectSolanaAddress(state)

    const balances: Balances = {} as Balances

    if (!address) {
      return rejectWithValue('No address found in state.')
    }

    // Create token balance param items as an empty array
    // Each object in this array is used as params for the balanceOf function
    let tokenBalanceParamItems: {
      chainKey: ChainKey
      chainId: number | null
      tokenKey: TokenKey
      tokenAddress: string
    }[] = []

    // Iterate over each token in the tokensConfig and create token balance param items
    for (const tokenKey in tokensConfig) {
      const token = tokensConfig[tokenKey as TokenKey]
      const chainKeys = Object.keys(token.addresses)
      for (const chainKey of chainKeys) {
        const chain = chainsConfig[chainKey as ChainKey]
        const tokenAddress = token.addresses[chainKey as ChainKey]
        if (!tokenAddress || tokenAddress === '0x') continue
        tokenBalanceParamItems.push({
          chainKey: chainKey as ChainKey,
          chainId: chain.id || null,
          tokenKey: tokenKey as TokenKey,
          tokenAddress,
        })
      }
    }

    // Fetch the balances for each token using the token balance param items
    // Just some advice: If this becomes any more complex, implement the strategy pattern
    // where there is a strategy for each token
    try {
      const balancePromises = tokenBalanceParamItems.map(async (tokenBalanceParamItem) => {
        const { chainKey, chainId, tokenKey, tokenAddress } = tokenBalanceParamItem

        if (tokenKey === TokenKey.ETH) {
          return { tokenKey: tokenKey as TokenKey, chainKey, balance: '0' }
        } else if (chainKey === ChainKey.ECLIPSE && solanaAddress) {
          const balance = await getSolanaBalance(solanaAddress, tokenAddress)
          return { tokenKey: tokenKey as TokenKey, chainKey, balance: balance.toString() }
        } else if (tokenAddress && chainId) {
          const balance = await balanceOf({
            balanceAddress: address,
            tokenAddress: tokenAddress as `0x${string}`,
            chainId,
          })
          return { tokenKey: tokenKey as TokenKey, chainKey, balance: balance.toString() }
        }
      })
      // * Used for debugging if a token balance is failing
      // const tempResults = await Promise.allSettled(balancePromises)
      // console.log('tempResults', TokenKey, tempResults)
      const results = await Promise.allSettled(balancePromises)

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const fulfilledResult = result.value
          if (fulfilledResult && fulfilledResult.tokenKey && fulfilledResult.chainKey) {
            if (!balances[fulfilledResult.tokenKey as TokenKey]) {
              balances[fulfilledResult.tokenKey as TokenKey] = {} as Record<ChainKey, string | null>
            }
            balances[fulfilledResult.tokenKey as TokenKey][fulfilledResult.chainKey as ChainKey] =
              fulfilledResult.balance
          }
        }
      }

      return { balances }
    } catch (e) {
      // Do nothing to process errors since we are constantly fetching balances.
    }
    return rejectWithValue('Error fetching token balances.')
  },

  // Setup a method to fetch token balanace without loading state.
  // This passes the ignoreLoading thunk argument to the fetchAllTokenBalances.pending action.
  // By doing this we can optionally ignore loading state for this thunk.
  // Example usage: dispatch(fetchAllTokenBalances({ ignoreLoading: true }))
  {
    getPendingMeta: ({ arg }) => {
      return { ignoreLoading: arg?.ignoreLoading }
    },
  }
)

export interface fetchEthBalanceResult {
  balance: string
}

export const fetchEthBalance = createAsyncThunk<fetchEthBalanceResult, void, { rejectValue: string; state: RootState }>(
  'balances/fetchEthBalance',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState()

    const address = selectAddress(state)

    if (!address) {
      return rejectWithValue('No address found in state.')
    }

    try {
      const { value: balance } = await getBalance(wagmiConfig, { address })
      return { balance: balance.toString() }
    } catch (e) {
      const error = e as Error
      const errorMessage = `Failed to fetch ETH balance for address ${address}.`
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

export interface fetchMultiChainTokenBalancesResult {
  balances: Record<ChainKey, Record<TokenKey, string | null>>
}

export const fetchMultiChainTokenBalances = createAsyncThunk<
  fetchMultiChainTokenBalancesResult,
  void,
  { rejectValue: string; state: RootState }
>('balances/fetchMultiChainTokenBalances', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const address = selectAddress(state)
  const balances: Record<ChainKey, Record<TokenKey, string | null>> = {} as Record<
    ChainKey,
    Record<TokenKey, string | null>
  >

  if (!address) {
    return rejectWithValue('No address found in state.')
  }

  try {
    const { value: balance } = await getBalance(wagmiConfig, { address })
    return { balances }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch ETH balance for address ${address}.`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
