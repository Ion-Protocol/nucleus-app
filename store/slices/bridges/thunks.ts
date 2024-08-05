import { getRate } from '@/api/contracts/Accountant/getRate'
import { getRateInQuoteSafe } from '@/api/contracts/Accountant/getRateInQuoteSafe'
import { getTotalSupply } from '@/api/contracts/BoringVault/getTotalSupply'
import { deposit } from '@/api/contracts/Teller/deposit'
import { depositAndBridge } from '@/api/contracts/Teller/depositAndBridge'
import { CrossChainTellerBase, previewFee } from '@/api/contracts/Teller/previewFee'
import { BridgeKey } from '@/config/chains'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectAddress } from '../account/slice'
import { selectTokenBalance } from '../balance'
import { selectChainId, selectChainKey, selectTokenAddress } from '../chain'
import { netApyApi } from '../netApy/api'
import { selectBridgeKey } from '../router'
import { setErrorMessage, setErrorTitle, setTransactionSuccessMessage, setTransactionTxHash } from '../status'
import {
  selectBridgeConfig,
  selectChainConfig,
  selectDepositAmountAsBigInt,
  selectDepositAssetAddress,
  selectDestinationBridge,
  selectFromTokenKeyForBridge,
  selectSourceBridge,
} from './selectors'
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
 * 2. Fetches the total supply of shares and the exchange rate from the contracts.
 * 3. Calculates the TVL using the formula: TVL = totalSupply * exchangeRate.
 * 4. Returns the TVL as a string along with the bridge key.
 * 5. Logs and dispatches an error if the fetch fails, and rejects with an error message.
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
  const chainConfig = selectChainConfig(state)
  const bridgeConfig = chainConfig?.bridges[bridgeKey]

  const vaultAddress = bridgeConfig?.contracts.boringVault
  const accountantAddress = bridgeConfig?.contracts.accountant
  if (!vaultAddress || !accountantAddress) {
    return { tvl: '0', bridgeKey }
  }

  try {
    // Fetch total supply of shares
    const totalSupply = await getTotalSupply(vaultAddress)

    // Fetch exchange rate
    const exchangeRate = await getRate(accountantAddress)

    // Calculate TVL
    const tvlInEth = (totalSupply * exchangeRate) / BigInt(1e18) // Adjust for 18 decimals
    const tvlAsString = tvlInEth.toString()

    return { tvl: tvlAsString, bridgeKey }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch TVL.\n${error.message}`
    console.error(`${errorMessage}\n${error.stack}`)
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
    const address = bridgeConfig?.contracts?.boringVault
    if (!address || !chainId) {
      return {
        bridgeKey,
        result: {
          apy: 0,
        },
      }
    }
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

  let fromFormatted = from.trim()

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
    const accountantAddress = bridge?.contracts?.accountant
    if (bridge?.comingSoon || !accountantAddress) {
      return { bridgeKey, result: { rate: '0' } }
    }
    const rateAsBigInt = await getRate(accountantAddress)
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
export const performDeposit = createAsyncThunk<PerformDepositResult, void, { rejectValue: string; state: RootState }>(
  'bridges/performDeposit',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState()
      const userAddress = selectAddress(state)

      const depositAssetKey = selectFromTokenKeyForBridge(state)
      const depositAsset = selectTokenAddress(depositAssetKey as TokenKey)(state)
      const depositAmount = selectDepositAmountAsBigInt(state)
      const bridgeConfig = selectBridgeConfig(state)
      const chainKey = selectChainKey(state)
      const sourceBridgeKey = selectSourceBridge(state)
      const destinationBridgeKey = selectDestinationBridge(state)

      const layerZeroChainSelector = bridgeConfig?.layerZeroChainSelector
      const tellerContractAddress = bridgeConfig?.contracts.teller
      const boringVaultAddress = bridgeConfig?.contracts.boringVault
      const accountantAddress = bridgeConfig?.contracts.accountant
      const wethAddress = chainKey ? tokensConfig?.weth.chains[chainKey].address : null

      if (
        layerZeroChainSelector !== undefined &&
        wethAddress &&
        userAddress &&
        tellerContractAddress &&
        boringVaultAddress &&
        accountantAddress &&
        sourceBridgeKey &&
        destinationBridgeKey &&
        depositAsset
      ) {
        const depositBridgeData: CrossChainTellerBase.BridgeData = {
          chainSelector: layerZeroChainSelector,
          destinationChainReceiver: userAddress,
          bridgeFeeToken: wethAddress,
          messageGas: 100000,
          data: '',
        }

        let txHash: `0x${string}`
        if (sourceBridgeKey === destinationBridgeKey) {
          // If the source chain and and destination chains are the same.
          // For example, both are Ethereum.
          // Deposit without bridging.
          txHash = await deposit(
            { depositAsset, depositAmount },
            { userAddress, tellerContractAddress, boringVaultAddress, accountantAddress }
          )
        } else {
          // If the source chain and and destination chains are different.
          // For example, the source is Ethereum and the destination is Optimism.
          // Deposit with bridging.
          txHash = await depositAndBridge(
            { depositAsset, depositAmount, bridgeData: depositBridgeData },
            { userAddress, tellerContractAddress, boringVaultAddress, accountantAddress }
          )
        }

        dispatch(setTransactionTxHash(txHash))
        dispatch(setTransactionSuccessMessage('Your deposit was successful!'))
        dispatch(setBridgeFrom(''))
        return { txHash }
      } else {
        dispatch(setErrorTitle('Deposit Failed'))
        dispatch(setErrorMessage('Some required values are missing'))
        return { txHash: '0x0' }
      }
    } catch (e) {
      const error = e as Error
      const errorMessage = `Failed to deposit`
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorTitle('Deposit Failed'))
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

export interface FetchPreviewFeeResult {
  fee: string
}

/**
 * Fetches the preview fee for a bridge.
 *
 * @param bridgeKey - The key of the bridge.
 * @param getState - A function to get the current state of the store.
 * @param rejectWithValue - A function to reject the promise with a value.
 * @param dispatch - A function to dispatch actions to the store.
 * @returns A promise that resolves to the preview fee result.
 */
export const fetchPreviewFee = createAsyncThunk<FetchPreviewFeeResult, void, { rejectValue: string; state: RootState }>(
  'bridges/fetchPreviewFee',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState()
      const bridgeConfig = selectBridgeConfig(state)
      const chainKey = selectChainKey(state)
      const depositAmount = selectDepositAmountAsBigInt(state)
      const depositAsset = selectDepositAssetAddress(state)

      const tellerContractAddress = bridgeConfig?.contracts.teller
      const accountantContractAddress = bridgeConfig?.contracts.accountant
      const layerZeroChainSelector = bridgeConfig?.layerZeroChainSelector
      const wethAddress = chainKey ? tokensConfig?.weth.chains[chainKey].address : null

      if (
        tellerContractAddress &&
        accountantContractAddress &&
        depositAmount &&
        depositAsset &&
        layerZeroChainSelector &&
        wethAddress
      ) {
        const previewFeeBridgeData: CrossChainTellerBase.BridgeData = {
          chainSelector: layerZeroChainSelector,
          destinationChainReceiver: tellerContractAddress,
          bridgeFeeToken: wethAddress,
          messageGas: 1_000_000,
          data: '',
        }

        const exchangeRate = await getRateInQuoteSafe(
          { quote: depositAsset },
          { contractAddress: accountantContractAddress }
        )

        const shareAmount = (depositAmount * WAD.bigint) / exchangeRate

        const fee = await previewFee(
          { shareAmount, bridgeData: previewFeeBridgeData },
          { contractAddress: tellerContractAddress }
        )
        return { fee: fee.toString() }
      } else {
        return rejectWithValue('Missing contract address or layer zero chain selector')
      }
    } catch (e) {
      const error = e as Error
      const errorMessage = `Failed to get preview fee`
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorTitle('Preview Fee failed'))
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)
