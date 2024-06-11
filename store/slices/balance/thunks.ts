import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { readContract } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { setError } from '../status'

export interface FetchWeETHBalanceResult {
  balance: string
}

/**
 * /////////////////////////////////////////////////////////////////////
 * This thunk is here just to demonstrate how to read from the contract.
 * It's unlikely that we will need this specific thunk.
 * /////////////////////////////////////////////////////////////////////
 *
 * Fetches the balance of the WeETH token for the current account.
 *
 * @returns A promise that resolves to an object containing the balance of the WeETH token.
 * @throws If there is an error while fetching the balance.
 */
export const fetchWeETHBalance = createAsyncThunk<
  FetchWeETHBalanceResult,
  void,
  { rejectValue: string; state: RootState }
>('balances/fetchWeETHBalance', async (_, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()
    const address = state.account.address
    if (!address) return { balance: BigInt(0).toString() }
    const balance = await readContract(wagmiConfig, {
      abi: erc20Abi,
      address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
      functionName: 'balanceOf',
      args: [address],
    })
    return { balance: balance.toString() }
  } catch (e) {
    const error = e as Error
    const errorMessage = 'Failed to fetch WeETH balance.'
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
