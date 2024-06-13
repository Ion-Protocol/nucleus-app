import { RootState } from '@/store'
import { utils } from '@/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setError } from '../status'
import { BridgeKey } from '@/config/bridges'
import { TokenKey, tokensConfig } from '@/config/token'
import { Token } from '@/types/Token'

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

/**
 * Sets the "from" value for a bridge asynchronously.
 *
 * This is in a thunk because it needs to access RootState.
 *
 * @param from - The value to set as the "from" value for the bridge.
 * @param options - The options object containing the state and reject value.
 * @returns A promise that resolves to an object containing the bridge key and the "from" value.
 * @throws If the bridge key is missing in the router query.
 */
export const setBridgeFrom = createAsyncThunk<
  { bridgeKey: BridgeKey; from: string },
  string,
  { state: RootState; rejectValue: string }
>('bridges/setBridgeFrom', async (from, { getState, rejectWithValue, dispatch }) => {
  const state = getState() as RootState
  const bridgeKey = state.router.query?.bridge as BridgeKey

  if (!bridgeKey) {
    throw new Error('Bridge key is missing in router query')
  }

  let fromFormatted = parseFloat(from).toString()

  if (isNaN(parseFloat(fromFormatted))) {
    fromFormatted = ''
  }

  return { bridgeKey, from: fromFormatted }
})

/**
 * Sets the bridge destination for a given bridge key.
 *
 * This is in a thunk because it needs to access RootState.
 *
 * @param to - The destination value to set for the bridge.
 * @param getState - A function that returns the current state of the Redux store.
 * @param rejectWithValue - A function that can be used to reject the async thunk with a specific value.
 * @param dispatch - A function that can be used to dispatch actions within the async thunk.
 * @returns A promise that resolves to an object containing the bridge key and the destination value.
 */
export const setBridgeTo = createAsyncThunk<
  { bridgeKey: BridgeKey; to: string },
  string,
  { state: RootState; rejectValue: string }
>('bridges/setBridgeTo', async (to, { getState, rejectWithValue, dispatch }) => {
  const state = getState() as RootState
  const bridgeKey = state.router.query?.bridge as BridgeKey

  if (!bridgeKey) {
    throw new Error('Bridge key is missing in router query')
  }

  const toWithoutLeadingZeroes = parseFloat(to).toString()

  return { bridgeKey, to: toWithoutLeadingZeroes }
})

/**
 * Sets the bridge token asynchronously.
 *
 * @param token - The token to set.
 * @param options - The options object.
 * @param options.state - The root state of the Redux store.
 * @param options.rejectValue - The value to reject with if the async action fails.
 * @returns A promise that resolves to an object containing the bridge key and token.
 * @throws An error if the bridge key is missing in the router query.
 */
export const setBridgeToken = createAsyncThunk<
  { bridgeKey: BridgeKey; tokenKey: TokenKey },
  TokenKey,
  { state: RootState; rejectValue: string }
>('bridges/setBridgeToken', async (tokenKey, { getState, rejectWithValue, dispatch }) => {
  const state = getState() as RootState
  const bridgeKey = state.router.query?.bridge as BridgeKey

  if (!bridgeKey) {
    throw new Error('Bridge key is missing in router query')
  }

  return { bridgeKey, tokenKey }
})
