import { getRate } from '@/api/contracts/Accountant/getRate'
import { deposit } from '@/api/contracts/Teller/deposit'
import { BridgeKey } from '@/config/bridges'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { utils } from '@/utils'
import { WAD } from '@/utils/bigint'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setError, setSuccess } from '../status'
import { selectBridgeFrom, selectBridgeTokenKey } from './selectors'

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

export interface FetchBridgeRateResult {
  rate: string
}

export const fetchBridgeRate = createAsyncThunk<
  { bridgeKey: BridgeKey; result: FetchBridgeRateResult },
  BridgeKey,
  { rejectValue: string; state: RootState }
>('bridges/fetchBridgeRate', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  try {
    const rateAsBigInt = await getRate(bridgeKey)
    return { bridgeKey, result: { rate: rateAsBigInt.toString() } }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch rate for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

export interface PerformDepositResult {
  txHash: `0x${string}`
}

/**
 * Performs a deposit for a bridge.
 *
 * @param bridgeKey - The key of the bridge.
 * @param getState - A function to get the current state of the application.
 * @param rejectWithValue - A function to reject the async thunk with a value.
 * @param dispatch - A function to dispatch actions.
 * @returns A promise that resolves to the transaction hash of the deposit.
 */
export const performDeposit = createAsyncThunk<
  PerformDepositResult,
  BridgeKey,
  { rejectValue: string; state: RootState }
>('bridges/deposit', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()

    const depositAssetKey = selectBridgeTokenKey(state, bridgeKey)
    const depositAsset = tokensConfig[depositAssetKey as TokenKey].address

    const depositAmountAsString = selectBridgeFrom(state, bridgeKey)
    const depositAmount = BigInt(parseFloat(depositAmountAsString) * WAD.number)

    const minimumMint = depositAmount / BigInt(1.01 * WAD.number) / WAD.bigint

    const txHash = await deposit({ depositAsset, depositAmount, minimumMint }, { bridgeKey })

    dispatch(setSuccess('Deposit successful!'))

    return { txHash: '0x' }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to deposit for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
