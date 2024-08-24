import { getRate } from '@/api/contracts/Accountant/getRate'
import { getRateInQuoteSafe } from '@/api/contracts/Accountant/getRateInQuoteSafe'
import { getTotalSupply } from '@/api/contracts/BoringVault/getTotalSupply'
import { deposit } from '@/api/contracts/Teller/deposit'
import { depositAndBridge } from '@/api/contracts/Teller/depositAndBridge'
import { CrossChainTellerBase, previewFee } from '@/api/contracts/Teller/previewFee'
import { BridgeKey } from '@/types/BridgeKey'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectAddress } from '../account/slice'
import { selectTokenBalance } from '../balance'
import { selectBridgeKey } from '../router'
import { setErrorMessage, setErrorTitle, setTransactionSuccessMessage, setTransactionTxHash } from '../status'
import {
  selectBridgeConfig,
  selectChainConfig,
  selectChainKeyByChainId,
  selectDepositAmountAsBigInt,
  selectFeeTokenAddress,
  selectFromTokenKeyForBridge,
  selectSourceBridge,
  selectSourceBridgeChainId,
  selectTellerAddress,
} from './selectors'
import { setInputError } from './slice'
import { selectChainId, selectChainKey } from '../chain'
import { switchChain } from 'wagmi/actions'
import { wagmiConfig } from '@/config/wagmi'
import { TokenKey } from '@/types/TokenKey'
import { nativeAddress } from '@/config/constants'
import { getTokenPerShareRate } from './getTokenPerShareRate'

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
    const totalSharesSupply = await getTotalSupply(vaultAddress, { chainId: 1 })

    // Fetch exchange rate
    const tokenPerShareRate = await getTokenPerShareRate(bridgeKey, accountantAddress) // 1e18

    // Calculate TVL
    const tvlInToken = (totalSharesSupply * tokenPerShareRate) / BigInt(1e18) // Adjust for 18 decimals
    const tvlAsString = tvlInToken.toString()

    return { tvl: tvlAsString, bridgeKey }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch TVL.\n${error.message}`
    console.error(`${errorMessage}\n${error.stack}`)
    dispatch(setErrorMessage(errorMessage))
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
  const bridgeKeyFromRoute = selectBridgeKey(state)
  const bridgeKeyFromChainSelector = selectSourceBridge(state)

  if (!bridgeKeyFromRoute) {
    throw new Error('Bridge key is missing in router query')
  }

  let fromFormatted = from.trim()

  if (isNaN(parseFloat(fromFormatted))) {
    fromFormatted = ''
  }

  const tokenKey = selectFromTokenKeyForBridge(state)
  const tokenBalance = selectTokenBalance(bridgeKeyFromChainSelector, tokenKey)(state)
  const tokenBalanceAsNumber = tokenBalance ? bigIntToNumber(BigInt(tokenBalance)) : null

  if ((tokenBalanceAsNumber && parseFloat(from) > parseFloat(tokenBalanceAsNumber)) || tokenBalanceAsNumber === null) {
    console.log('Here?')
    const inputError = 'Insufficient balance'
    dispatch(setInputError(inputError))
  }

  return { bridgeKey: bridgeKeyFromRoute, from: fromFormatted }
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
  const bridgeKeyFromSourceChain = selectSourceBridge(state) as BridgeKey
  const bridgeKeyFromUrl = selectBridgeKey(state)
  if (!bridgeKeyFromUrl) {
    return rejectWithValue('Bridge key is missing in router query')
  }
  const tokenKey = selectFromTokenKeyForBridge(state)
  const tokenBalance = selectTokenBalance(bridgeKeyFromSourceChain, tokenKey)(state)
  const tokenBalanceAsNumber = tokenBalance ? bigIntToNumber(BigInt(tokenBalance)) : '0'

  return { bridgeKey: bridgeKeyFromUrl, from: tokenBalanceAsNumber }
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
    const bridgeConfig = selectBridgeConfig(state)
    const accountantAddress = bridgeConfig?.contracts?.accountant
    if (bridgeConfig?.comingSoon || !accountantAddress) {
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

      const depositAmount = selectDepositAmountAsBigInt(state)
      const chainId = selectChainId(state)
      const bridgeKey = selectBridgeKey(state)
      const bridgeConfig = selectBridgeConfig(state)
      const sourceBridgeKey = selectSourceBridge(state)
      const sourceBridgeChainId = selectSourceBridgeChainId(state)
      const tellerAddress = selectTellerAddress(state)
      const feeTokenAddress = selectFeeTokenAddress(state)

      const layerZeroChainSelector = bridgeConfig?.layerZeroChainSelector
      const tellerContractAddress = bridgeConfig?.contracts.teller
      const boringVaultAddress = bridgeConfig?.contracts.boringVault
      const accountantAddress = bridgeConfig?.contracts.accountant
      const wethAddress = sourceBridgeKey
        ? tokensConfig?.[TokenKey.WETH].chains[sourceBridgeKey as BridgeKey]?.address || null
        : null
      const depositAssetTokenKey = selectFromTokenKeyForBridge(state)
      const depositAsset =
        depositAssetTokenKey && sourceBridgeKey
          ? tokensConfig[depositAssetTokenKey]?.chains[sourceBridgeKey as BridgeKey]?.address
          : null

      if (
        accountantAddress &&
        boringVaultAddress &&
        bridgeKey &&
        depositAsset &&
        layerZeroChainSelector !== undefined &&
        sourceBridgeKey &&
        sourceBridgeChainId &&
        tellerContractAddress &&
        feeTokenAddress &&
        tellerAddress &&
        userAddress &&
        wethAddress
      ) {
        // if chain needs to switch, switch it
        if (chainId !== sourceBridgeChainId) {
          await switchChain(wagmiConfig, { chainId: sourceBridgeChainId })
        }

        const depositBridgeData: CrossChainTellerBase.BridgeData = {
          chainSelector: layerZeroChainSelector,
          destinationChainReceiver: tellerAddress,
          bridgeFeeToken: feeTokenAddress,
          messageGas: 100000,
          data: '',
        }

        let txHash: `0x${string}`
        if (sourceBridgeKey === bridgeKey) {
          ///////////////////////////////////////////////////////////////
          // Source chain and current bridge are the same
          // Deposit only
          ///////////////////////////////////////////////////////////////

          // For example, both are Sei,
          // Deposit without bridging.
          txHash = await deposit(
            { depositAsset, depositAmount },
            {
              userAddress,
              tellerContractAddress,
              boringVaultAddress,
              accountantAddress,
              chainId: sourceBridgeChainId,
            }
          )
        } else {
          ///////////////////////////////////////////////////////////////
          // Source chain and bridge are different
          // Deposit & Bridge
          ///////////////////////////////////////////////////////////////

          // If the source chain and and destination chains are different.
          // For example, the source is Ethereum and the destination is Optimism.
          // Deposit with bridging.

          ///////////////////////////////////////////////////////////////
          // First: Get updated preview fee
          ///////////////////////////////////////////////////////////////
          const exchangeRate = await getRateInQuoteSafe(
            { quote: depositAsset },
            { contractAddress: accountantAddress, chainId: sourceBridgeChainId }
          )

          const shareAmount = (depositAmount * WAD.bigint) / exchangeRate

          const fee = await previewFee(
            { shareAmount, bridgeData: depositBridgeData },
            { contractAddress: tellerContractAddress, chainId: sourceBridgeChainId }
          )

          // Add 1% to the fee for padding to prevent the contract from reverting
          // This extra amount will be refunded
          const paddedFee = (fee * BigInt(101)) / BigInt(100)

          ///////////////////////////////////////////////////////////////
          // Second: Deposit and bridge
          ///////////////////////////////////////////////////////////////
          txHash = await depositAndBridge(
            { depositAsset, depositAmount, bridgeData: depositBridgeData },
            {
              userAddress,
              tellerContractAddress,
              boringVaultAddress,
              accountantAddress,
              chainId: sourceBridgeChainId,
              fee: paddedFee,
            }
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
      const depositAmount = selectDepositAmountAsBigInt(state)
      const sourceChainKey = selectSourceBridge(state)
      const depositAssetTokenKey = selectFromTokenKeyForBridge(state)

      if (!depositAssetTokenKey || !sourceChainKey) {
        return rejectWithValue('Missing deposit asset token key')
      }

      const depositAssetAddress = tokensConfig[depositAssetTokenKey]?.chains[sourceChainKey]?.address

      const tellerContractAddress = bridgeConfig?.contracts.teller
      const accountantContractAddress = bridgeConfig?.contracts.accountant
      const layerZeroChainSelector = bridgeConfig?.layerZeroChainSelector

      if (
        tellerContractAddress &&
        accountantContractAddress &&
        depositAmount &&
        layerZeroChainSelector &&
        depositAssetAddress
      ) {
        const previewFeeBridgeData: CrossChainTellerBase.BridgeData = {
          chainSelector: layerZeroChainSelector,
          destinationChainReceiver: tellerContractAddress,
          bridgeFeeToken: nativeAddress,
          messageGas: 100_000,
          data: '',
        }

        const exchangeRate = await getRateInQuoteSafe(
          { quote: depositAssetAddress },
          { contractAddress: accountantContractAddress, chainId: 1 }
        )

        const shareAmount = (depositAmount * WAD.bigint) / exchangeRate

        const fee = await previewFee(
          { shareAmount, bridgeData: previewFeeBridgeData },
          { contractAddress: tellerContractAddress, chainId: 1 }
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
