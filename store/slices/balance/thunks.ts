import { balanceOf } from '@/api/contracts/erc20/balanceOf'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setError } from '../status'

export interface FetchWeETHBalanceResult {
  balance: string
}

/**
 * Fetches the token balance asynchronously.
 *
 * @param tokenAddress - The address for which the balance needs to be retrieved.
 * @param balanceAddress - The address of the ERC20 token.
 * @returns A promise that resolves to the fetched token balance.
 */
export const fetchTokenBalance = createAsyncThunk<
  FetchWeETHBalanceResult,
  { tokenAddress: `0x${string}`; balanceAddress: `0x${string}` },
  { rejectValue: string; state: RootState }
>('balances/fetchTokenBalance', async (args, { getState, rejectWithValue, dispatch }) => {
  const { tokenAddress, balanceAddress } = args
  try {
    const balanceAsBigInt = await balanceOf({ tokenAddress, balanceAddress })
    return { balance: balanceAsBigInt.toString() }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch token balance for token address ${tokenAddress} on address ${balanceAddress}.`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
