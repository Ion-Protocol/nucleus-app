import { balanceOf } from '@/api/contracts/erc20/balanceOf'
import { TokenKey, tokensConfig } from '@/config/token'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getBalance } from 'wagmi/actions'
import { selectAddress } from '../account'
import { setError } from '../status'

export interface fetchAllTokenBalancesResult {
  balances: Record<TokenKey, string>
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
  void,
  { rejectValue: string; state: RootState }
>('balances/fetchAllTokenBalances', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()
  const address = selectAddress(state)
  const balances: Record<TokenKey, string> = {} as Record<TokenKey, string>

  if (!address) {
    const errorMessage = 'Address not found in state'
    console.error(errorMessage)
    dispatch(setError(errorMessage))
    return rejectWithValue(errorMessage)
  }

  try {
    const balancePromises = Object.keys(tokensConfig).map(async (tokenKey) => {
      if (tokenKey === TokenKey.ETH) {
        // Fetch ETH balance
        const { value: balance } = await getBalance(wagmiConfig, { address })
        return { tokenKey: tokenKey as TokenKey, balance: balance.toString() }
      } else {
        // Fetch ERC20 token balance
        const token = tokensConfig[tokenKey as TokenKey]
        const tokenAddress = token.address

        const balance = await balanceOf({ balanceAddress: address, tokenAddress })
        return { tokenKey: tokenKey as TokenKey, balance: balance.toString() }
      }
    })

    const results = await Promise.all(balancePromises)

    results.forEach((result) => {
      balances[result.tokenKey] = result.balance
    })

    return { balances }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch token balance for address ${address}.`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
