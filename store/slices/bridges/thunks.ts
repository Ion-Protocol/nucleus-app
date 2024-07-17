import { getRate } from '@/api/contracts/Accountant/getRate'
import { deposit } from '@/api/contracts/Teller/deposit'
import { BridgeKey } from '@/config/chains'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectAddress } from '../account/slice'
import { selectTokenBalance } from '../balance'
import { selectChain, selectChainId } from '../chain'
import { netApyApi } from '../netApy/api'
import { selectBridgeKey } from '../router'
import { setErrorMessage, setErrorTitle, setTransactionSuccessMessage, setTransactionTxHash } from '../status'
import { calculateTvl, getTotalAssetBalanceWithPools } from './helpers'
import { selectBridgeConfig, selectBridgeFrom, selectFromTokenKeyForBridge } from './selectors'
import { setInputError } from './slice'

export interface FetchBridgeTvlResult {
  bridgeKey: BridgeKey
  tvl: string
}

/**
 * Asynchronous thunk action to fetch the Total Value Locked (TVL) for a given bridge.
 *
 * This action:
 * 1. Retrieves the current chain key from the state.
 * 2. Fetches native token balances and exchange rates for the specified bridge.
 * 3. Calculates the TVL in ETH and returns it as a string along with the bridge key.
 * 4. Logs and dispatches an error if the fetch fails, and rejects with an error message.
 *
 * @param {BridgeKey} bridgeKey - The key identifying the bridge for which TVL is being fetched.
 * @param {Object} thunkAPI - An object containing getState, rejectWithValue, and dispatch functions provided by Redux Toolkit.
 * @returns {Promise<FetchBridgeTvlResult | string>} A promise that resolves to an object containing the TVL as a string
 * and the bridge key, or rejects with an error message.
 */
export const fetchBridgeTvl = createAsyncThunk<
  FetchBridgeTvlResult,
  BridgeKey,
  { rejectValue: string; state: RootState }
>('balances/fetchBridgeTvl', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  const state = getState()
  const chainKey = selectChain(state)
  const bridgeConfig = selectBridgeConfig(state)

  const vaultAddress = bridgeConfig.contracts.boringVault
  const acceptedTokens = bridgeConfig.sourceTokens

  // Native token balances are in their native units (e.g. wstETH, weETH, etc.)
  const nativeTokenBalancesPromise = Promise.all(
    acceptedTokens.map((tokenKey) => getTotalAssetBalanceWithPools({ tokenKey, chainKey, vaultAddress }))
  )
  // Token exchange rates are in ETH/token (e.g. ETH/wstETH, ETH/weETH, etc.)
  const tokenExchangeRatesPromise = Promise.all(acceptedTokens.map((tokenKey) => tokensConfig[tokenKey].getPrice()))

  try {
    const [nativeTokenBalances, tokenExchangeRates] = await Promise.all([
      nativeTokenBalancesPromise,
      tokenExchangeRatesPromise,
    ])

    // Calcualtes TVL and converts the native tokens to ETH
    const tvlInEth = calculateTvl(nativeTokenBalances, tokenExchangeRates)

    const tvlAsString = tvlInEth.toString()

    return { tvl: tvlAsString, bridgeKey }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch TVL.`
    const errorStack = error.stack ? `\nStack Trace:\n${error.stack}` : '' // Check if stack trace exists and append it
    console.error(`${errorMessage}\n${errorStack}`)
    dispatch(setErrorMessage(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

export interface FetchBridgeApyResult {
  apy: number
}

export const fetchBridgeApy = createAsyncThunk<
  { bridgeKey: BridgeKey; result: FetchBridgeApyResult },
  BridgeKey,
  { rejectValue: string; state: RootState }
>('bridges/fetchBridgeApy', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()
    const chainId = selectChainId(state)
    const bridgeConfig = selectBridgeConfig(state)
    const address = bridgeConfig.contracts.boringVault
    const resultAction = await dispatch(netApyApi.endpoints.getLatestNetApy.initiate({ address, chainId }))

    if ('error' in resultAction) {
      throw new Error('Error getting net apy for bridge')
    }

    const { data: netApyItem } = resultAction
    if (netApyItem) {
      return { bridgeKey, result: { apy: netApyItem.netApy } }
    } else {
      return { bridgeKey, result: { apy: 0 } }
    }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch APY for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

/**
 * Sets the "from" value for a bridge.
 *
 * This is in a thunk because it needs to access RootState to get the bridgeKey.
 *
 * TODO: Refactor to not use thunks for this.
 * If from value were not set per bridge this would not be necessary.
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

  const tokenKey = selectFromTokenKeyForBridge(state)
  const tokenBalance = selectTokenBalance(tokenKey)(state)
  const tokenBalanceAsNumber = bigIntToNumber(BigInt(tokenBalance))

  dispatch(setInputError(parseFloat(fromFormatted) > parseFloat(tokenBalanceAsNumber) ? 'Insufficient balance' : null))

  return { bridgeKey, from: fromFormatted }
})

/**
 * Sets the bridge from the maximum token balance.
 *
 * This is in a thunk because it needs to access RootState to get the bridgeKey.
 *
 * @param _ - The payload (not used).
 * @param getState - A function to get the current state.
 * @param rejectWithValue - A function to reject the promise with a value.
 * @param dispatch - A function to dispatch actions.
 * @returns A promise that resolves to an object containing the bridge key and the maximum token balance.
 * @throws An error if the bridge key is missing in the router query.
 */
export const setBridgeFromMax = createAsyncThunk<
  { bridgeKey: BridgeKey; from: string },
  void,
  { state: RootState; rejectValue: string }
>('bridges/setBridgeFromMax', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState() as RootState
  const bridgeKey = selectBridgeKey(state) as BridgeKey
  const tokenKey = selectFromTokenKeyForBridge(state)
  const tokenBalance = selectTokenBalance(tokenKey)(state)
  const tokenBalanceAsNumber = bigIntToNumber(BigInt(tokenBalance))

  return { bridgeKey, from: tokenBalanceAsNumber }
})

export interface FetchBridgeRateResult {
  rate: string
}

/**
 * Fetches the bridge rate for a given bridge key.
 * @param bridgeKey - The key of the bridge.
 * @returns A promise that resolves to an object containing the bridge key and the fetched bridge rate.
 * @throws If there is an error while fetching the rate.
 */
export const fetchBridgeRate = createAsyncThunk<
  { bridgeKey: BridgeKey; result: FetchBridgeRateResult },
  BridgeKey,
  { rejectValue: string; state: RootState }
>('bridges/fetchBridgeRate', async (bridgeKey, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()
    const bridge = selectBridgeConfig(state)
    if (bridge.comingSoon) {
      return { bridgeKey, result: { rate: '0' } }
    }
    const rateAsBigInt = await getRate(bridge.contracts.accountant)
    return { bridgeKey, result: { rate: rateAsBigInt.toString() } }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch rate for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
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
    const userAddress = selectAddress(state)

    const depositAssetKey = selectFromTokenKeyForBridge(state)
    const depositAsset = tokensConfig[depositAssetKey as TokenKey].address

    const depositAmountAsString = selectBridgeFrom(state)
    const depositAmount = BigInt(parseFloat(depositAmountAsString) * WAD.number)

    const bridge = selectBridgeConfig(state)
    const tellerContractAddress = bridge.contracts.teller
    const boringVaultAddress = bridge.contracts.boringVault
    const accountantAddress = bridge.contracts.accountant

    if (userAddress) {
      const txHash = await deposit(
        { depositAsset, depositAmount },
        { userAddress, tellerContractAddress, boringVaultAddress, accountantAddress }
      )
      dispatch(setTransactionSuccessMessage('Your deposit was successful!'))
      dispatch(setTransactionTxHash(txHash))
      dispatch(setBridgeFrom(''))
      return { txHash }
    } else {
      return { txHash: '0x0' }
    }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to deposit for bridge ${bridgeKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorTitle('Deposit Failed'))
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
