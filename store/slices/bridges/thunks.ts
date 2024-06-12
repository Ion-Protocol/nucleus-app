import { RootState } from '@/store'
import { utils } from '@/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setError } from '../status'
import { BridgeKey } from '@/types/Bridge'

export interface FetchBridgeTvlResult {
  tvl: string
}

export interface FetchBridgeApyResult {
  apy: string
}

// These thunks will likely change once I know how this data is loaded

export const fetchBridgeTvl = createAsyncThunk<
  { bridgeKey: BridgeKey; result: FetchBridgeTvlResult },
  BridgeKey,
  { rejectValue: string; state: RootState }
>('bridges/fetchBridgeTvl', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  try {
    await utils.sleep(2000)
    const tvl = BigInt(5022.123231 * 1e18).toString()
    return { bridgeKey, result: { tvl } }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch TVL for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

export const fetchBridgeApy = createAsyncThunk<
  { bridgeKey: BridgeKey; result: FetchBridgeApyResult },
  BridgeKey,
  { rejectValue: string; state: RootState }
>('bridges/fetchBridgeApy', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  try {
    await utils.sleep(3000)
    const apy = BigInt(2.234234 * 1e18).toString()
    return { bridgeKey, result: { apy } }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch APY for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
