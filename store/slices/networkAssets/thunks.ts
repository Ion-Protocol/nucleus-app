import { Accountant } from '@/api/contracts/Accountant'
import { getRateInQuoteSafe } from '@/api/contracts/Accountant/getRateInQuoteSafe'
import { getTotalSupply } from '@/api/contracts/BoringVault/getTotalSupply'
import { quoteGasPayment } from '@/api/contracts/GasRouter/quoteGasPayment'
import { getUserClaimedAmountOfAsset } from '@/api/contracts/MerkleClaim/usersClaimedAmountOfAsset'
import { deposit } from '@/api/contracts/Teller/deposit'
import { depositAndBridge } from '@/api/contracts/Teller/depositAndBridge'
import { CrossChainTellerBase, previewFee } from '@/api/contracts/Teller/previewFee'
import { transferRemote } from '@/api/contracts/TokenRouter/transferRemote'
import { chainsConfig } from '@/config/chains'
import {
  hyperlaneIdForEclipse,
  nativeAddress,
  pollBalanceAfterTransactionAttempts,
  pollBalanceAfterTransactionInterval,
} from '@/config/constants'
import { contractAddresses } from '@/config/contracts'
import { tokensConfig } from '@/config/tokens'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { WAD, bigIntToNumberAsString } from '@/utils/bigint'
import { truncateToSignificantDigits } from '@/utils/number'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Address } from 'viem'
import { switchChain } from 'wagmi/actions'
import { getTokenPerShareRate } from '../../../services/getTokenPerShareRate'
import { selectAddress } from '../account/slice'
import { fetchAllTokenBalances, selectTokenBalance } from '../balance'
import { selectNetworkId } from '../chain'
import { selectNetworkAssetFromRoute } from '../router'
import { setErrorMessage, setErrorTitle, setTransactionSuccessMessage, setTransactionTxHash } from '../status'
import { selectClaimableTokenAddresses, selectTotalClaimables, selectUserProof } from '../userProofSlice/selectors'
import {
  selectAvailableNetworkAssetKeys,
  selectContractAddressByName,
  selectDepositAmount,
  selectDepositAmountAsBigInt,
  selectDepositBridgeData,
  selectNetworkAssetConfig,
  selectNetworkAssetConfigByKey,
  selectNetworkConfig,
  selectSolanaAddressBytes32,
  selectSourceChainId,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectTokenAddressByTokenKey,
} from './selectors'
import { clearDepositAmount, setDepositAmount } from './slice'
import { claim } from '@/api/contracts/MerkleClaim/claim'

export type FetchPausedResult = Partial<Record<TokenKey, boolean>>

export const fetchPaused = createAsyncThunk<FetchPausedResult, void, { rejectValue: string; state: RootState }>(
  'balances/fetchPaused',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState()
      const networkConfig = selectNetworkConfig(state)

      if (!networkConfig) {
        return {}
      }

      const availableNetworkAssetKeys = selectAvailableNetworkAssetKeys(state)
      const pausedNetworksArray = await Promise.all(
        availableNetworkAssetKeys.map(async (networkAssetKey) => {
          const accountantAddress = networkConfig.assets[networkAssetKey]?.contracts.accountant
          if (!accountantAddress) return { key: networkAssetKey, isPaused: false }
          const accountantState = await Accountant.accountantState(accountantAddress)
          return { key: networkAssetKey, isPaused: accountantState.isPaused }
        })
      )

      const pausedNetworks = pausedNetworksArray.reduce((acc, { key, isPaused }) => {
        acc[key] = isPaused
        return acc
      }, {} as FetchPausedResult)

      return pausedNetworks
    } catch (e) {
      const error = e as Error
      const errorMessage = `Failed to fetch paused state.\n${error.message}`
      console.error(`${errorMessage}\n${error.stack}`)
      dispatch(setErrorMessage(errorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)
export interface FetchClaimedAmountsOfAssetsResult {
  claimed: Partial<Record<TokenKey, string>>
}

export const fetchClaimedAmountsOfAssets = createAsyncThunk<
  FetchClaimedAmountsOfAssetsResult,
  void,
  { rejectValue: string; state: RootState }
>('balances/fetchClaimedAmountsOfAssets', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()
  const userAddress = selectAddress(state)
  const claims = selectTotalClaimables(state)

  if (!userAddress || claims.length === 0) return { claimed: {} }

  try {
    const claimedAmountsAsArray = await Promise.all(
      claims.map((claim) => {
        const assetAddress = tokensConfig[claim.tokenKey]?.addresses[claim.chainKey] as `0x${string}`
        return getUserClaimedAmountOfAsset(
          { userAddress, assetAddress },
          { merkleClaimAddress: contractAddresses.merkleClaim, chainId: 308712 }
        )
      })
    )

    // Convert the array of claimed amounts to an object
    const claimed = claims.reduce(
      (acc, claim, index) => {
        acc[claim.tokenKey] = claimedAmountsAsArray[index].toString()
        return acc
      },
      {} as Partial<Record<TokenKey, string>>
    )
    return { claimed }
  } catch (e) {
    const error = e as Error
    const errorMessage = `Failed to fetch claimed amount of asset.\n${error.message}`
    console.error(`${errorMessage}\n${error.stack}`)
    dispatch(setErrorMessage(errorMessage))
    return rejectWithValue(errorMessage)
  }
})

interface ClaimRewardsResult {
  txHash: `0x${string}` | null
}

export const claimRewards = createAsyncThunk<ClaimRewardsResult, void, { rejectValue: string; state: RootState }>(
  'bridges/claimRewards',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState()
      const proof = selectUserProof(state)
      const userAddress = selectAddress(state)
      const claimables = selectTotalClaimables(state)
      const claimableTokenAddresses = selectClaimableTokenAddresses(state)
      const chainId = selectNetworkId(state)

      if (!userAddress) {
        return { txHash: null }
      }

      const claimableAmounts = claimables.map((claimable) => BigInt(claimable.amount))

      //////////////////////////////////////////////////////////////////////////
      // Switch chains if needed
      //   If the chain the wallet is connected to does not match the source
      //   chain that the user selected, switch it to the source chain.
      //////////////////////////////////////////////////////////////////////////
      if (chainId !== 1329) {
        await switchChain(wagmiConfig, { chainId: 1329 })
      }

      const txHash = await claim(
        { proof, user: userAddress, assets: claimableTokenAddresses, totalClaimableForAsset: claimableAmounts },
        { merkleClaimContractAddress: contractAddresses.merkleClaim }
      )

      return { txHash }
    } catch (e) {
      console.error(e)
      const error = e as Error
      const errorMessage = `Claim failed`
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      dispatch(setErrorTitle('Claim Not Verified'))
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

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
    const networkAssetKey = selectNetworkAssetFromRoute(state)
    const chainKeyFromSourceChain = selectSourceChainKey(state) as ChainKey
    const tokenKey = selectSourceTokenKey(state)
    const tokenBalance = selectTokenBalance(state, chainKeyFromSourceChain, tokenKey)

    let tokenBalanceAsNumber = tokenBalance
      ? bigIntToNumberAsString(BigInt(tokenBalance), { maximumFractionDigits: 18 })
      : '0'

    if (networkAssetKey === TokenKey.TETH) {
      tokenBalanceAsNumber = truncateToSignificantDigits(tokenBalanceAsNumber, 9)
    }

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
      { quote: despositAssetAddress as `0x${string}` },
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
export const performDeposit = createAsyncThunk<PerformDepositResult, void, { rejectValue: string; state: RootState }>(
  'bridges/performDeposit',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState()

      const userAddress = selectAddress(state)
      const depositAmount = selectDepositAmountAsBigInt(state)
      const fromAmount = selectDepositAmount(state)
      const chainId = selectNetworkId(state)
      const chainKeyFromRoute = selectNetworkAssetFromRoute(state)
      const sourceChain = selectSourceChainKey(state)
      const networkAssetKey = selectNetworkAssetFromRoute(state)
      const networkAssetConfig = selectNetworkAssetConfig(state)
      const sourceChainId = selectSourceChainId(state)
      const tellerAddress = selectContractAddressByName(state, 'teller')
      const solanaAddressBytes32 = selectSolanaAddressBytes32(state)

      const layerZeroChainSelector = networkAssetConfig?.layerZeroChainSelector
      const tellerContractAddress = networkAssetConfig?.contracts.teller
      const boringVaultAddress = networkAssetConfig?.contracts.boringVault
      const accountantAddress = networkAssetConfig?.contracts.accountant
      const depositAssetTokenKey = selectSourceTokenKey(state)
      const depositAsset =
        depositAssetTokenKey && sourceChain
          ? tokensConfig[depositAssetTokenKey]?.addresses[sourceChain as ChainKey]
          : null

      // This is the functional destination chain, not the receiveOn chain which
      // is more of a user facing property
      const destinationChain = networkAssetConfig?.deployedOn

      if (
        !accountantAddress ||
        !boringVaultAddress ||
        !chainKeyFromRoute ||
        !depositAsset ||
        !networkAssetKey ||
        !sourceChain ||
        !sourceChainId ||
        !tellerContractAddress ||
        !tellerAddress ||
        !userAddress ||
        !destinationChain
      ) {
        dispatch(setErrorTitle('Missing required values'))
        dispatch(setErrorMessage('Missing required values'))
        throw new Error('Missing required values')
      }

      ///////////////////////////////////////////////////////////////
      // Deposit Steps
      ///////////////////////////////////////////////////////////////

      let depositTxHash: `0x${string}` | null = null
      let transferRemoteTxHash: `0x${string}` | null = null

      //////////////////////////////////////////////////////////////////////////
      // 1. Switch chains if needed
      //     If the chain the wallet is connected to does not match the source
      //     chain that the user selected, switch it to the source chain.
      //////////////////////////////////////////////////////////////////////////
      if (chainId !== sourceChainId) {
        await switchChain(wagmiConfig, { chainId: sourceChainId })
      }

      //////////////////////////////////////////////////////////////////////////
      // 2. Perform the deposit
      //      If source chain chosen by the user is the same as the destination chain determined by the config
      //        Call deposit function
      //        If network asset is tETH
      //          Also call transferRemote function to complete the bridge
      //      Else
      //        Get preview fee
      //        Call depositAndBridge function
      //
      // Notes:
      //   - The destination chain is not the same as the receiveOn chain
      //   - The destination chain represents the desitnation of the deposit or
      //     depositAndBridge function
      //   - So in the case of tETH, although the ultimate destination from the
      //     user's perspective is Eclipse (receiveOn), the destination for the
      //     function call is mainnet Ethereum, meaning the source chain is equal
      //     to the destination chain functionally.
      //////////////////////////////////////////////////////////////////////////

      if (sourceChain === destinationChain) {
        // If source chain chosen by the user is the same as the destination chain determined by the config
        // Get the chain id that the deposit function is being called on
        const deployedOnChainId = chainsConfig[destinationChain].id
        if (!deployedOnChainId) {
          throw new Error(`Chain ${destinationChain} does not exist in the chain config`)
        }

        // Call deposit function
        depositTxHash = await deposit(
          { depositAsset: depositAsset as `0x${string}`, depositAmount },
          {
            userAddress,
            tellerContractAddress,
            boringVaultAddress,
            accountantAddress,
            chainId: deployedOnChainId,
          }
        )

        //////////////////////////////////////////////////////////////////////////
        // For tETH only
        //////////////////////////////////////////////////////////////////////////

        // If network asset is tETH, also call transferRemote function to complete the bridge
        // This is necessary because bridging is done separately using hyperlane for just the tETH asset.
        // This may be updated as more network assets are added.
        if (networkAssetKey === TokenKey.TETH) {
          const bridgeGasFee = await quoteGasPayment(
            { destinationDomain: hyperlaneIdForEclipse },
            { contractAddress: contractAddresses.hyperlaneWarpRoute }
          )
          transferRemoteTxHash = await transferRemote(
            {
              destination: hyperlaneIdForEclipse,
              recipient: solanaAddressBytes32,
              amount: depositAmount,
            },
            {
              userAddress,
              tokenRouterAddress: contractAddresses.hyperlaneWarpRoute,
              bridgeAsset: tokensConfig[TokenKey.TETH].addresses[ChainKey.ETHEREUM] as Address,
              bridgeGasFee,
            }
          )
        }
      } else {
        // Else if source chain chosen by the user is NOT the same as the destination chain determined by the config

        // Get the preview fee for bridging the asset
        let previewFeeAsBigInt: bigint = BigInt(0)
        const depositBridgeData = selectDepositBridgeData(state)
        if (!depositBridgeData) throw new Error('Missing deposit bridge data')

        // Get most up-to-date preview fee
        if (layerZeroChainSelector && depositBridgeData) {
          previewFeeAsBigInt = await previewFee(
            { shareAmount: depositAmount, bridgeData: depositBridgeData },
            { contractAddress: tellerContractAddress }
          )
        }

        // Call depositAndBridge function
        depositTxHash = await depositAndBridge(
          { depositAsset: depositAsset as `0x${string}`, depositAmount, bridgeData: depositBridgeData },
          {
            userAddress,
            tellerContractAddress,
            boringVaultAddress,
            accountantAddress,
            fee: previewFeeAsBigInt,
          }
        )
      }

      // Show success modal
      dispatch(setTransactionSuccessMessage(`Deposited ${fromAmount} ${depositAssetTokenKey}`))
      dispatch(setTransactionTxHash(depositTxHash))

      // Side effects
      dispatch(fetchAllTokenBalances({ ignoreLoading: true }))
      dispatch(clearDepositAmount())

      //////////////////////////////////////////////////////////////////////////
      // 3. Get updated balance
      //      It's necessary to poll the balance after the transaction because
      //      the balance is not updated immediately after the transaction is
      //      submitted.
      //////////////////////////////////////////////////////////////////////////

      // Poll balance after transaction every 10 seconds for 2 minutes
      for (let i = 0; i < pollBalanceAfterTransactionAttempts; i++) {
        setTimeout(() => {
          dispatch(fetchAllTokenBalances({ ignoreLoading: true }))
        }, i * pollBalanceAfterTransactionInterval)
      }

      return { txHash: depositTxHash }
    } catch (e) {
      console.error(e)
      const error = e as Error
      // const errorMessage = `Your transaction was submitted but we couldn’t verify its completion. Please look at your wallet transactions to verify a successful transaction.`
      const errorMessage = `Deposit failed`
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      dispatch(setErrorTitle('Deposit Not Verified'))
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)

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
      const networkAssetKey = selectNetworkAssetFromRoute(state)
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
      const layerZeroChainSelector = chainConfig?.layerZeroChainSelector || 0

      if (
        tellerContractAddress &&
        accountantContractAddress &&
        depositAmount &&
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
          { quote: depositAssetAddress as `0x${string}` },
          { contractAddress: accountantContractAddress, chainId }
        )

        const shareAmount = (depositAmount * WAD.bigint) / exchangeRate

        // Get the fee based on the network asset
        let fee = BigInt(0)

        // If the network asset is tETH, get the gas payment
        if (networkAssetKey === TokenKey.TETH) {
          fee = await quoteGasPayment(
            { destinationDomain: hyperlaneIdForEclipse },
            { contractAddress: contractAddresses.hyperlaneWarpRoute }
          )
        } else {
          // Otherwise, get the preview fee
          fee = await previewFee(
            { shareAmount, bridgeData: previewFeeBridgeData },
            { contractAddress: tellerContractAddress }
          )
        }

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
