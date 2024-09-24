import { getRateInQuote } from '@/api/contracts/Accountant/getRateInQuote'
import { getRateInQuoteSafe } from '@/api/contracts/Accountant/getRateInQuoteSafe'
import { getTotalSupply } from '@/api/contracts/BoringVault/getTotalSupply'
import { deposit } from '@/api/contracts/Teller/deposit'
import { depositAndBridge } from '@/api/contracts/Teller/depositAndBridge'
import { CrossChainTellerBase, previewFee } from '@/api/contracts/Teller/previewFee'
import { calculateMinimumMint } from '@/api/utils/calculateMinimumMint'
import {
  nativeAddress,
  pollBalanceAfterTransactionAttempts,
  pollBalanceAfterTransactionInterval,
} from '@/config/constants'
import { tokensConfig } from '@/config/tokens'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { WAD, bigIntToNumberAsString } from '@/utils/bigint'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { switchChain } from 'wagmi/actions'
import { selectAddress } from '../account/slice'
import { fetchAllTokenBalances, selectTokenBalance } from '../balance'
import { selectNetworkId } from '../chain'
import { selectNetworkAssetFromRoute } from '../router'
import { setErrorMessage, setErrorTitle, setTransactionSuccessMessage, setTransactionTxHash } from '../status'
import { getTokenPerShareRate } from './getTokenPerShareRate'
import {
  selectContractAddressByName,
  selectDepositAmount,
  selectDepositAmountAsBigInt,
  selectDepositAndBridgeCheckoutParams,
  selectDepositBridgeData,
  selectNetworkAssetConfig,
  selectNetworkAssetConfigByKey,
  selectShouldUseFunCheckout,
  selectSourceChainId,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectTokenAddressByTokenKey,
} from './selectors'
import { clearDepositAmount, setDepositAmount } from './slice'
import { chainsConfig } from '@/config/chains'

export interface FetchNetworkAssetTvlResult {
  tokenKey: TokenKey
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
 * @returns {Promise<FetchNetworkAssetTvlResult | string>} A promise that resolves to an object containing the TVL as a string
 * and the chain key, or rejects with an error message.
 */
export const fetchNetworkAssetTvl = createAsyncThunk<
  FetchNetworkAssetTvlResult,
  TokenKey,
  { rejectValue: string; state: RootState }
>('balances/fetchNetworkAssetTvl', async (tokenKey, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const networkAssetConfig = selectNetworkAssetConfigByKey(state, tokenKey)
  if (!networkAssetConfig) {
    return { tvl: '0', tokenKey }
  }
  const vaultAddress = networkAssetConfig?.contracts.boringVault
  const accountantAddress = networkAssetConfig?.contracts.accountant

  const deployedOnChainId = chainsConfig[networkAssetConfig.deployedOn].id

  if (!deployedOnChainId) {
    const errorMessage = `Chain ${networkAssetConfig.deployedOn} does not have a chain id`
    dispatch(setErrorMessage(errorMessage))
    return rejectWithValue(errorMessage)
  }

  if (!vaultAddress || !accountantAddress) {
    return { tvl: '0', tokenKey }
  }

  try {
    // Fetch total supply of shares
    const totalSharesSupply = await getTotalSupply(vaultAddress, { chainId: deployedOnChainId })

    // Fetch exchange rate
    const tokenPerShareRate = await getTokenPerShareRate(tokenKey, accountantAddress) // 1e18

    // Calculate TVL
    const tvlInToken = (totalSharesSupply * tokenPerShareRate) / WAD.bigint // Adjust for 18 decimals
    const tvlAsString = tvlInToken.toString()

    return { tvl: tvlAsString, tokenKey }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch TVL.\n${error.message}`
    console.error(`${errorMessage}\n${error.stack}`)
    dispatch(setErrorMessage(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

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
export const setDepositAmountMax = createAsyncThunk<void, void, { state: RootState; rejectValue: string }>(
  'bridges/setDepositAmountMax',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState
    const chainKeyFromSourceChain = selectSourceChainKey(state) as ChainKey
    const tokenKey = selectSourceTokenKey(state)
    const tokenBalance = selectTokenBalance(state, chainKeyFromSourceChain, tokenKey)
    const tokenBalanceAsNumber = tokenBalance
      ? bigIntToNumberAsString(BigInt(tokenBalance), { maximumFractionDigits: 18 })
      : '0'

    // Using dispatch within the thunk to trigger the setInputValue action so
    // that the the previewFee side effect will also trigger
    dispatch(setDepositAmount(tokenBalanceAsNumber))
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
  try {
    const state = getState()
    const accountantAddress = selectContractAddressByName(state, 'accountant')
    const despositAssetAddress = selectTokenAddressByTokenKey(state, depositAssetKey)
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
    const chainKeyFromRoute = selectNetworkAssetFromRoute(state)
    const chainKeyFromSelector = selectSourceChainKey(state)
    const networkAssetConfig = selectNetworkAssetConfig(state)
    const sourceChainId = selectSourceChainId(state)
    const tellerAddress = selectContractAddressByName(state, 'teller')

    const layerZeroChainSelector = networkAssetConfig?.layerZeroChainSelector
    const tellerContractAddress = networkAssetConfig?.contracts.teller
    const boringVaultAddress = networkAssetConfig?.contracts.boringVault
    const accountantAddress = networkAssetConfig?.contracts.accountant
    const depositAssetTokenKey = selectSourceTokenKey(state)
    const depositAsset =
      depositAssetTokenKey && chainKeyFromSelector
        ? tokensConfig[depositAssetTokenKey]?.addresses[chainKeyFromSelector as ChainKey]
        : null
    const deployedOn = networkAssetConfig?.deployedOn

    if (
      !accountantAddress ||
      !boringVaultAddress ||
      !chainKeyFromRoute ||
      !depositAsset ||
      !chainKeyFromSelector ||
      !sourceChainId ||
      !tellerContractAddress ||
      !tellerAddress ||
      !userAddress ||
      !deployedOn
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

    const depositingToSameChain = chainKeyFromSelector === deployedOn
    if (depositingToSameChain) {
      ///////////////////////////////////////////////////////////////
      // Depositing on same chain without bridging
      // Deposit only
      ///////////////////////////////////////////////////////////////

      // For example, both are Sei,
      // Deposit without bridging.
      const deployedOnChainId = chainsConfig[deployedOn].id
      if (!deployedOnChainId) {
        throw new Error(`Chain ${deployedOn} does not exist in the chain config`)
      }
      txHash = await deposit(
        { depositAsset, depositAmount },
        {
          userAddress,
          tellerContractAddress,
          boringVaultAddress,
          accountantAddress,
          chainId: deployedOnChainId,
        }
      )

      dispatch(setTransactionSuccessMessage(`Deposited ${fromAmount} ${depositAssetTokenKey}`))
      dispatch(setTransactionTxHash(txHash))
    } else {
      ///////////////////////////////////////////////////////////////
      // Source chain is Ethereum
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
      // 3. Deposit and bridge
      ///////////////////////////////////////////////////////////////

      // Check if user has enough balance
      const shouldUseFunCheckout = selectShouldUseFunCheckout(state)

      if (shouldUseFunCheckout) {
        const params = selectDepositAndBridgeCheckoutParams(state)
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
        dispatch(clearDepositAmount())
      }
    }

    // Poll balance after transaction every 10 seconds for 2 minutes
    for (let i = 0; i < pollBalanceAfterTransactionAttempts; i++) {
      setTimeout(() => {
        dispatch(fetchAllTokenBalances({ ignoreLoading: true }))
      }, i * pollBalanceAfterTransactionInterval)
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
      const chainConfig = selectNetworkAssetConfig(state)
      const depositAmount = selectDepositAmountAsBigInt(state)
      const chainKeyFromSelector = selectSourceChainKey(state)
      const depositAssetTokenKey = selectSourceTokenKey(state)
      const chainId = selectSourceChainId(state)
      const userAddress = selectAddress(state)

      if (!depositAssetTokenKey || !chainKeyFromSelector) {
        return rejectWithValue('Missing deposit asset token key')
      }

      const depositAssetAddress = tokensConfig[depositAssetTokenKey]?.addresses[chainKeyFromSelector]

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
