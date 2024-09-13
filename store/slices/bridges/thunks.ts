import { getRateInQuote } from '@/api/contracts/Accountant/getRateInQuote'
import { getRateInQuoteSafe } from '@/api/contracts/Accountant/getRateInQuoteSafe'
import { getTotalSupply } from '@/api/contracts/BoringVault/getTotalSupply'
import { deposit } from '@/api/contracts/Teller/deposit'
import { depositAndBridge } from '@/api/contracts/Teller/depositAndBridge'
import { CrossChainTellerBase, previewFee } from '@/api/contracts/Teller/previewFee'
import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import { nativeAddress } from '@/config/constants'
import { tokensConfig } from '@/config/token'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { switchChain } from 'wagmi/actions'
import { selectAddress } from '../account/slice'
import { fetchAllTokenBalances, selectTokenBalance } from '../balance'
import { selectNetworkId } from '../chain'
import { selectChainKeyFromRoute } from '../router'
import { setErrorMessage, setErrorTitle, setTransactionSuccessMessage, setTransactionTxHash } from '../status'
import { getTokenPerShareRate } from './getTokenPerShareRate'
import {
  selectChainConfig,
  selectContractAddressByName,
  selectDepositAmount,
  selectDepositAmountAsBigInt,
  selectDepositAndBridgeCheckoutParams,
  selectDepositBridgeData,
  selectNetworkConfig,
  selectShouldUseFunCheckout,
  selectSourceChainId,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectTokenAddressByTokenKey,
} from './selectors'
import { clearInputValue, setInputValue } from './slice'

export interface FetchChainTvlResult {
  chainKey: ChainKey
  tvl: string
}

/**
 * Asynchronous thunk action to fetch the Total Value Locked (TVL) for a given chain.
 *
 * This action:
 * 1. Retrieves the current chain key from the state.
 * 2. Fetches the total supply of shares and the exchange rate from the contracts.
 * 3. Calculates the TVL using the formula: TVL = totalSupply * exchangeRate.
 * 4. Returns the TVL as a string along with the chain key.
 * 5. Logs and dispatches an error if the fetch fails, and rejects with an error message.
 *
 * @param {ChainKey} chainKey - The key identifying the chain for which TVL is being fetched.
 * @param {Object} thunkAPI - An object containing getState, rejectWithValue, and dispatch functions provided by Redux Toolkit.
 * @returns {Promise<FetchChainTvlResult | string>} A promise that resolves to an object containing the TVL as a string
 * and the chain key, or rejects with an error message.
 */
export const fetchChainTvl = createAsyncThunk<FetchChainTvlResult, ChainKey, { rejectValue: string; state: RootState }>(
  'balances/fetchChainTvl',
  async (chainKey, { getState, rejectWithValue, dispatch }) => {
    const state = getState()
    const networkConfig = selectNetworkConfig(state)
    const chainConfig = networkConfig?.chains[chainKey]
    const chainId = chainConfig?.chainId

    const vaultAddress = chainConfig?.contracts.boringVault
    const accountantAddress = chainConfig?.contracts.accountant
    if (!vaultAddress || !accountantAddress || !chainId) {
      return { tvl: '0', chainKey: chainKey }
    }

    try {
      // Fetch total supply of shares
      const totalSharesSupply = await getTotalSupply(vaultAddress, { chainId })

      // Fetch exchange rate
      const tokenPerShareRate = await getTokenPerShareRate(chainKey, accountantAddress) // 1e18

      // Calculate TVL
      const tvlInToken = (totalSharesSupply * tokenPerShareRate) / BigInt(1e18) // Adjust for 18 decimals
      const tvlAsString = tvlInToken.toString()

      return { tvl: tvlAsString, chainKey: chainKey }
    } catch (e) {
      const error = e as Error
      const errorMessage = `Failed to fetch TVL.\n${error.message}`
      console.error(`${errorMessage}\n${error.stack}`)
      dispatch(setErrorMessage(errorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

/**
 * Sets the bridge input value to the maximum token balance.
 *
 * This is in a thunk because it needs to access the wallet balance.
 *
 * @param _ - The payload (not used).
 * @param getState - A function to get the current state.
 * @param rejectWithValue - A function to reject the promise with a value.
 * @param dispatch - A function to dispatch actions.
 * @returns A promise that resolves to an object containing the bridge key and the maximum token balance.
 * @throws An error if the bridge key is missing in the router query.
 */
export const setBridgeInputMax = createAsyncThunk<void, void, { state: RootState; rejectValue: string }>(
  'bridges/setBridgeInputMax',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState
    const chainKeyFromSourceChain = selectSourceChainKey(state) as ChainKey
    const tokenKey = selectSourceTokenKey(state)
    const tokenBalance = selectTokenBalance(chainKeyFromSourceChain, tokenKey)(state)
    const tokenBalanceAsNumber = tokenBalance ? bigIntToNumber(BigInt(tokenBalance)) : '0'

    // Using dispatch within the thunk to trigger the setInputValue action so
    // that the the previewFee side effect will also trigger
    dispatch(setInputValue(tokenBalanceAsNumber))
  }
)

export interface FetchChainRateResult {
  rate: string | null
}

export const fetchTokenRateInQuote = createAsyncThunk<
  { result: FetchChainRateResult },
  TokenKey,
  { rejectValue: string; state: RootState }
>('bridges/fetchTokenRateInQuote', async (depositAssetKey, { getState, rejectWithValue, dispatch }) => {
  console.log('fetch rate')
  try {
    const state = getState()
    const accountantAddress = selectContractAddressByName('accountant')(state)
    const despositAssetAddress = selectTokenAddressByTokenKey(depositAssetKey)(state)
    const chainId = selectSourceChainId(state)

    if (!despositAssetAddress || !accountantAddress || !chainId) return { result: { rate: null } }

    const rateAsBigInt = await getRateInQuoteSafe(
      { quote: despositAssetAddress },
      { contractAddress: accountantAddress, chainId }
    )
    return { result: { rate: rateAsBigInt.toString() } }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch rate for token ${depositAssetKey}`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

export interface PerformDepositResult {
  txHash: `0x${string}` | null
}

/**
 * Performs a deposit for a bridge.
 *
 * @param chainKey - The key of the chain.
 * @param getState - A function to get the current state of the application.
 * @param rejectWithValue - A function to reject the async thunk with a value.
 * @param dispatch - A function to dispatch actions.
 * @returns A promise that resolves to the transaction hash of the deposit.
 */
export const performDeposit = createAsyncThunk<
  PerformDepositResult,
  (inputConfig?: any) => Promise<void>,
  { rejectValue: string; state: RootState }
>('bridges/performDeposit', async (beginCheckout, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()

    const userAddress = selectAddress(state)
    const depositAmount = selectDepositAmountAsBigInt(state)
    const fromAmount = selectDepositAmount(state)
    const chainId = selectNetworkId(state)
    const chainKeyFromRoute = selectChainKeyFromRoute(state)
    const chainKeyFromSelector = selectSourceChainKey(state)
    const chainConfig = selectChainConfig(state)
    const sourceChainId = selectSourceChainId(state)
    const tellerAddress = selectContractAddressByName('teller')(state)

    const layerZeroChainSelector = chainConfig?.layerZeroChainSelector
    const tellerContractAddress = chainConfig?.contracts.teller
    const boringVaultAddress = chainConfig?.contracts.boringVault
    const accountantAddress = chainConfig?.contracts.accountant
    const depositAssetTokenKey = selectSourceTokenKey(state)
    const depositAsset =
      depositAssetTokenKey && chainKeyFromSelector
        ? tokensConfig[depositAssetTokenKey]?.chains[chainKeyFromSelector as ChainKey]?.address
        : null

    if (
      !accountantAddress ||
      !boringVaultAddress ||
      !chainKeyFromRoute ||
      !depositAsset ||
      !chainKeyFromSelector ||
      !sourceChainId ||
      !tellerContractAddress ||
      !tellerAddress ||
      !userAddress
    ) {
      dispatch(setErrorTitle('Missing required values'))
      dispatch(setErrorMessage('Missing required values'))
      throw new Error('Missing required values')
    }

    // if chain needs to switch, switch it
    if (chainId !== sourceChainId) {
      await switchChain(wagmiConfig, { chainId: sourceChainId })
    }

    let txHash: `0x${string}` | null = null

    if (chainKeyFromSelector === chainKeyFromRoute) {
      ///////////////////////////////////////////////////////////////
      // Source chain and current chain are the same
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
          chainId: sourceChainId,
        }
      )

      dispatch(setTransactionSuccessMessage(`Deposited ${fromAmount} ${depositAssetTokenKey}`))
      dispatch(setTransactionTxHash(txHash))
    } else {
      ///////////////////////////////////////////////////////////////
      // Source chain and current chain are different
      // Deposit & Bridge
      ///////////////////////////////////////////////////////////////
      let previewFeeAsBigInt: bigint = BigInt(0)
      const depositBridgeData = selectDepositBridgeData(state)

      ///////////////////////////////////////////////////////////////
      // 1. Load up-to-date preview fee into the store
      ///////////////////////////////////////////////////////////////
      if (layerZeroChainSelector && depositBridgeData) {
        previewFeeAsBigInt = await previewFee(
          { shareAmount: depositAmount, bridgeData: depositBridgeData },
          { contractAddress: tellerContractAddress }
        )
      }

      ///////////////////////////////////////////////////////////////
      // 2. Calculate minimum mint
      ///////////////////////////////////////////////////////////////
      const rate = await getRateInQuote({ quote: depositAsset }, { contractAddress: accountantAddress })
      const minimumMint = calculateMinimumMint(depositAmount, rate)

      ///////////////////////////////////////////////////////////////
      // 3. Deposit and bridge
      ///////////////////////////////////////////////////////////////

      // Check if user has enough balance
      const shouldUseFunCheckout = selectShouldUseFunCheckout(state)

      if (shouldUseFunCheckout) {
        const params = selectDepositAndBridgeCheckoutParams(minimumMint)(state)
        if (params === null) {
          throw new Error('Missing checkout params')
        }
        await beginCheckout(params)
      } else {
        if (!depositBridgeData) throw new Error('Missing deposit bridge data')
        txHash = await depositAndBridge(
          { depositAsset, depositAmount, bridgeData: depositBridgeData },
          {
            userAddress,
            tellerContractAddress,
            boringVaultAddress,
            accountantAddress,
            fee: previewFeeAsBigInt,
          }
        )
        dispatch(setTransactionSuccessMessage(`Deposited ${fromAmount} ${depositAssetTokenKey}`))
        dispatch(setTransactionTxHash(txHash))
        dispatch(fetchAllTokenBalances())
        dispatch(clearInputValue())
      }
    }

    return { txHash }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Your transaction was submitted but we couldn’t verify its completion. Please look at your wallet transactions to verify a successful transaction.`
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorTitle('Deposit Not Verified'))
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

export interface FetchPreviewFeeResult {
  fee: string
}

/**
 * Fetches the preview fee for a chain.
 *
 * @param chainKey - The key of the chain.
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
      const chainConfig = selectChainConfig(state)
      const depositAmount = selectDepositAmountAsBigInt(state)
      const chainKeyFromSelector = selectSourceChainKey(state)
      const depositAssetTokenKey = selectSourceTokenKey(state)
      const chainId = selectSourceChainId(state)
      const userAddress = selectAddress(state)

      if (!depositAssetTokenKey || !chainKeyFromSelector) {
        return rejectWithValue('Missing deposit asset token key')
      }

      const depositAssetAddress = tokensConfig[depositAssetTokenKey]?.chains[chainKeyFromSelector]?.address

      const tellerContractAddress = chainConfig?.contracts.teller
      const accountantContractAddress = chainConfig?.contracts.accountant
      const layerZeroChainSelector = chainConfig?.layerZeroChainSelector

      if (
        tellerContractAddress &&
        accountantContractAddress &&
        depositAmount &&
        layerZeroChainSelector &&
        chainId &&
        userAddress &&
        depositAssetAddress
      ) {
        const previewFeeBridgeData: CrossChainTellerBase.BridgeData = {
          chainSelector: layerZeroChainSelector,
          destinationChainReceiver: userAddress,
          bridgeFeeToken: nativeAddress,
          messageGas: 100_000,
          data: '',
        }

        const exchangeRate = await getRateInQuoteSafe(
          { quote: depositAssetAddress },
          { contractAddress: accountantContractAddress, chainId }
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
