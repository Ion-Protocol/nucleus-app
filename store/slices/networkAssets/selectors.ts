import { CrossChainTellerBase } from '@/api/contracts/Teller/previewFee'
import { Chain, chainsConfig } from '@/config/chains'
import { defaultWithdrawalFee, hardcodedApy, nativeAddress } from '@/config/constants'
import { NetworkKey, networksConfig } from '@/config/networks'
import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { type BridgeData } from '@/store/slices/tellerApi'
import { NetworkAsset } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { RewardsTableData } from '@/types/RewardsTableData'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber, bigIntToNumberAsString, WAD } from '@/utils/bigint'
import { convertToUsd } from '@/utils/currency'
import { isValidSolanaAddress } from '@/utils/misc'
import { abbreviateNumber, convertToDecimals, hasMoreThanNSignificantDigits, numberToPercent } from '@/utils/number'
import { createSelector } from '@reduxjs/toolkit'
import bs58 from 'bs58'
import { Address, toHex } from 'viem'
import { selectAddress } from '../account'
import { selectBalances } from '../balance'
import { selectNetworkKey } from '../chain'
import { selectPriceLoading, selectUsdPerEthRate } from '../price'
import { selectNetworkAssetFromRoute } from '../router'
import { selectTransactionExplorerUrl } from '../status'
import { selectTotalClaimables } from '../userProofSlice/selectors'
import { calculateApy } from './calculateApy'

const USE_FUNKIT = process.env.NEXT_PUBLIC_USE_FUNKIT === 'true'

// Following Redux standards for memoization ensures efficient state management
// by avoiding unnecessary recalculations.
// https://redux.js.org/usage/deriving-data-selectors#balance-selector-usage

/////////////////////////////////////////////////////////////////////
// Principal Selectors: Influences the result of many other selectors
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Simple state access; should be a plain function.
export const selectBridgesState = (state: RootState) => state.networkAssets

// DO NOT memoize: Direct lookup; returns a value from state.
export const selectSourceChainKey = (state: RootState) => selectBridgesState(state).sourceChain

export const selectRedeemSourceChain = (state: RootState) => state.networkAssets.redeemSourceChain

// DO NOT memoize: Direct lookup; returns a value from state.
export const selectRedemptionSourceChainKey = (state: RootState) => state.networkAssets.redeemSourceChain

export const selectRedemptionDestinationChainKey = (state: RootState) => {
  const withdrawalDestinationChainKey = selectBridgesState(state).redeemDestinationChain
  return withdrawalDestinationChainKey
}
/////////////////////////////////////////////////////////////////////
// Config Selectors
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectNetworkConfig = (state: RootState) => {
  const networkKey = selectNetworkKey(state)
  if (!networkKey) return null
  return networksConfig[networkKey]
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectNetworkAssetConfig = (state: RootState): NetworkAsset | null => {
  const networkConfig = selectNetworkConfig(state)
  const networkAsset = selectNetworkAssetFromRoute(state)
  if (!networkAsset || !networkConfig) return null
  return networkConfig.assets[networkAsset] as NetworkAsset
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectNetworkAssetConfigByKey = (state: RootState, networkAssetKey: TokenKey): NetworkAsset | null => {
  const networkConfig = selectNetworkConfig(state)
  if (!networkConfig) return null
  const networkAsset = networkConfig.assets[networkAssetKey as TokenKey] as NetworkAsset
  return networkAsset
}

// SHOULD memoize: Returns a new array; memoization avoids unnecessary recalculations.
export const selectAllNetworkAssetKeys = createSelector([selectNetworkConfig], (networkConfig): TokenKey[] => {
  if (!networkConfig) return []
  return Object.keys(networkConfig.assets) as TokenKey[]
})

// SHOULD memoize: Returns a new array after filtering; memoization avoids unnecessary recalculations.
export const selectAvailableNetworkAssetKeys = createSelector(
  [selectAllNetworkAssetKeys, selectNetworkConfig],
  (networkAssetKeys, networkConfig): TokenKey[] => {
    if (!networkConfig) return []
    const availabilityFilter = (key: TokenKey) => {
      const networkAsset = networkConfig.assets[key]
      return networkAsset?.comingSoon !== true && networkAsset?.manuallyPaused !== true
    }
    return networkAssetKeys.filter(availabilityFilter)
  }
)

// DO NOT memoize: Direct lookup; should be a plain function.
export const selectContractAddressByName = (state: RootState, name: string) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  return networkAssetConfig?.contracts[name as keyof typeof networkAssetConfig.contracts]
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectLayerZeroChainSelector = (state: RootState): number => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  return networkAssetConfig?.layerZeroChainSelector || 0
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectHyperlaneChainSelector = (state: RootState): number => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  return networkAssetConfig?.hyperlaneChainSelector || 0
}

export const selectRedeemLayerZeroChainSelector = (state: RootState): number => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  return networkAssetConfig?.redeem.layerZeroChainSelector || 0
}

export const selectRedeemHyperlaneChainSelector = (state: RootState): number => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  return networkAssetConfig?.redeem.hyperlaneChainSelector || 0
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectReceiveOnChain = (state: RootState) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  if (!networkAssetConfig) return null
  return networkAssetConfig.redeem?.redemptionDestinationChain
}

export const selectNetworkCount = createSelector(
  (state: RootState) => networksConfig[NetworkKey.MAINNET],
  (networkConfig) => {
    const networkAssetsAsArray = Object.keys(networkConfig.assets)
    const uniqueChains: ChainKey[] = []
    for (const networkAsset of networkAssetsAsArray) {
      const chain = networkConfig.assets[networkAsset as TokenKey]?.chain
      if (chain && !uniqueChains.includes(chain)) {
        uniqueChains.push(chain)
      }
    }
    return uniqueChains.length
  }
)

/////////////////////////////////////////////////////////////////////
// Nav Drawer
/////////////////////////////////////////////////////////////////////

// SHOULD memoize: Returns a new array of objects; memoization avoids unnecessary recalculations.
export const selectNetworkAssetsAsArray = createSelector(
  [selectNetworkConfig],
  (networkConfig): (NetworkAsset & { key: TokenKey })[] => {
    if (!networkConfig) return []
    return Object.keys(networkConfig.assets).map((key) => ({
      key: key as TokenKey,
      ...(networkConfig.assets[key as TokenKey] as NetworkAsset),
    }))
  }
)

/////////////////////////////////////////////////////////////////////
// Automatic Pausing
/////////////////////////////////////////////////////////////////////

export const selectAutomaticallyPausedNetworkAssets = (state: RootState) => {
  return state.networkAssets.automaticallyPaused.data
}

export const selectNetworkAssetPaused = (state: RootState): boolean => {
  const networkAssetKeyFromRoute = selectNetworkAssetFromRoute(state)
  if (!networkAssetKeyFromRoute) return false
  return state.networkAssets.automaticallyPaused.data[networkAssetKeyFromRoute] || false
}

/////////////////////////////////////////////////////////////////////
// Rewards
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Simple state access; memoization not necessary.
export const selectClaimedAmountsOfAssets = (state: RootState) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.claimed.data
}

export const selectRewardsTableData = createSelector(
  [selectTotalClaimables, selectClaimedAmountsOfAssets],
  (totalClaimables, claimedAmounts): RewardsTableData[] => {
    const tableData: RewardsTableData[] = totalClaimables.map((totalClaimable) => {
      // What's been claimed is read from the contracts.
      // Total claimable is read from the backend api.
      // Available claimable is what has been claimed subtracted from the total claimable.

      const tokenSymbol = tokensConfig[totalClaimable.tokenKey].symbol

      const claimedAmountAsString = claimedAmounts[totalClaimable.tokenKey]
      const claimedAmountAsBigInt = BigInt(claimedAmountAsString || '0')
      const claimedAmountAsFloat = bigIntToNumberAsString(claimedAmountAsBigInt, {
        decimals: totalClaimable.decimals,
      })
      const formattedClaimedAmount = `${claimedAmountAsFloat} ${tokenSymbol}`

      const totalClaimableAmountAsBigInt = BigInt(totalClaimable.amount)
      const claimableAmountAsBigInt = totalClaimableAmountAsBigInt - claimedAmountAsBigInt
      const claimableAmountAsFloat = bigIntToNumberAsString(claimableAmountAsBigInt, {
        decimals: totalClaimable.decimals,
      })
      const formattedClaimableAmount = `${claimableAmountAsFloat} ${tokenSymbol}`

      return {
        tokenKey: totalClaimable.tokenKey,
        tokenSymbol,
        claimedTokenAmount: formattedClaimedAmount,
        claimedInUsd: '',
        claimableTokenAmount: formattedClaimableAmount,
        claimableInUsd: '',
      }
    })

    return tableData
  }
)

export const selectClaimables = createSelector(
  [selectTotalClaimables, selectClaimedAmountsOfAssets],
  (totalClaimables, claimedAmounts) => {
    const claimables = totalClaimables.map((totalClaimable) => {
      const claimedAmountAsString = claimedAmounts[totalClaimable.tokenKey]
      const claimedAmountAsBigInt = BigInt(claimedAmountAsString || '0')
      const totalClaimableAmountAsBigInt = BigInt(totalClaimable.amount)
      const claimableAmountAsBigInt = totalClaimableAmountAsBigInt - claimedAmountAsBigInt
      return {
        tokenKey: totalClaimable.tokenKey,
        chainKey: totalClaimable.chainKey,
        amount: claimableAmountAsBigInt,
      }
    })

    return claimables
  }
)

export const selectClaimPending = (state: RootState) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.claim.pending || bridgesState.claimed.loading
}

/////////////////////////////////////////////////////////////////////
// TVL
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Simple state access; should be a plain function.
export const selectTvlLoading = (state: RootState) => state.networkAssets.tvl.loading

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectNetworkAssetTvlByKey = (state: RootState, networkAssetKey: TokenKey) => {
  const bridgesState = selectBridgesState(state)
  const tvl = bridgesState.tvl.data[networkAssetKey]
  if (!tvl) return BigInt(0)
  return BigInt(tvl.toString())
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectActiveChainTvl = (state: RootState) => {
  const bridgesState = selectBridgesState(state)
  const tokenKey = selectNetworkAssetFromRoute(state)
  if (tokenKey === null) return null
  const tvl = bridgesState.tvl.data[tokenKey] || null
  if (tvl === null) return null
  return BigInt(tvl.toString())
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectFormattedNetworkAssetTvlByKey = (state: RootState, tokenKey: TokenKey) => {
  const tvl = selectNetworkAssetTvlByKey(state, tokenKey)
  const price = selectUsdPerEthRate(state)
  if (tvl === null) return '-'
  const tvlInUsdAsBigInt = (tvl * price) / BigInt(1e8)
  const tvlInUsdAsNumber = bigIntToNumber(tvlInUsdAsBigInt)
  return abbreviateNumber(tvlInUsdAsNumber)
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectActiveFormattedNetworkAssetTvl = (state: RootState) => {
  const tvl = selectActiveChainTvl(state)
  const price = selectUsdPerEthRate(state)
  if (tvl === null) return '-'
  const tvlInUsdAsBigInt = (tvl * price) / BigInt(1e8)
  const tvlInUsdAsNumber = bigIntToNumber(tvlInUsdAsBigInt)
  return abbreviateNumber(tvlInUsdAsNumber)
}

export const selectTotalTvl = (state: RootState) => {
  const tvl = Object.values(state.networkAssets.tvl.data).reduce((acc, curr) => acc + BigInt(curr), BigInt(0))
  return tvl
}

export const selectFormattedTotalTvl = (state: RootState) => {
  const tvl = selectTotalTvl(state)
  const price = selectUsdPerEthRate(state)
  const tvlInUsdAsBigInt = (tvl * price) / BigInt(1e8)
  const tvlInUsdAsNumber = bigIntToNumber(tvlInUsdAsBigInt)

  // Format the number as currency in USD
  const formattedTvlInUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(tvlInUsdAsNumber)

  return formattedTvlInUsd
}

/////////////////////////////////////////////////////////////////////
// APY
/////////////////////////////////////////////////////////////////////

// SHOULD memoize: Returns a new array; memoization avoids unnecessary recalculations.
export const selectApyTokenKeys = createSelector([selectNetworkAssetConfigByKey], (networkAssetConfig) => {
  if (!networkAssetConfig) return []
  return Object.keys(networkAssetConfig.apys) as TokenKey[]
})

// SHOULD memoize: Performs calculations; memoization avoids unnecessary recalculations.
export const selectNetworkAssetApy = createSelector(
  [
    (_state, _networkAssetKey: TokenKey, apyTokenKey: TokenKey) => apyTokenKey,
    selectNetworkAssetConfigByKey,
    selectNetworkAssetTvlByKey,
    selectUsdPerEthRate,
  ],
  (apyTokenKey, networkAssetConfig, tvlInEth, usdPerEthRate) => {
    const networkAssetApyData = networkAssetConfig?.apys[apyTokenKey]
    if (!networkAssetApyData) return null
    const apy = calculateApy(networkAssetApyData, tvlInEth, usdPerEthRate)
    return apy
  }
)

// SHOULD memoize: Performs calculations; memoization avoids unnecessary recalculations.
export const selectNetApy = createSelector(
  [
    (_state, networkAssetKey: TokenKey) => networkAssetKey,
    selectNetworkConfig,
    selectNetworkAssetTvlByKey,
    selectUsdPerEthRate,
  ],
  (networkAssetKey, networkConfig, tvlInEth, usdPerEthRate) => {
    const networkAssetConfig = networkConfig?.assets[networkAssetKey]
    if (!networkAssetConfig) return null
    const networkApy = networkAssetConfig.apys

    const tokenIncentiveSum = Object.keys(networkApy).reduce((sum, tokenKey) => {
      const apyData = networkApy[tokenKey as TokenKey] || []
      const apy = calculateApy(apyData, tvlInEth, usdPerEthRate)
      return sum + apy
    }, 0)

    return tokenIncentiveSum + hardcodedApy
  }
)

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectFormattedNetApy = (state: RootState, networkAssetKey: TokenKey) => {
  const netApy = selectNetApy(state, networkAssetKey)
  if (!netApy) return '0.0%'
  if (netApy >= 250) {
    return '>250%'
  }
  return numberToPercent(netApy)
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectShouldShowMessageForLargeNetApy = (state: RootState, networkAssetKey: TokenKey) => {
  const netApy = selectNetApy(state, networkAssetKey)
  if (!netApy) return false
  if (netApy >= 250) {
    return true
  }
  return false
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectNetApyLoading = (state: RootState) => {
  const tvlLoading = selectTvlLoading(state)
  const priceLoading = selectPriceLoading(state)
  return tvlLoading || priceLoading
}

/////////////////////////////////////////////////////////////////////
// Rewards & Points
/////////////////////////////////////////////////////////////////////

// SHOULD memoize: Returns a new array if undefined; memoization avoids returning new references.
export const selectPointsSystemForNetworkAsset = createSelector(
  [(_state, networkAssetKey: TokenKey) => networkAssetKey, selectNetworkConfig],
  (networkAssetKey, networkConfig) => {
    const networkAssetConfig = networkConfig?.assets[networkAssetKey]
    return networkAssetConfig?.points || []
  }
)

// SHOULD memoize: Returns a new array; memoization avoids unnecessary recalculations.
export const selectPointSystemKeysForNetworkAsset = createSelector(
  [(_state, networkAssetKey: TokenKey) => networkAssetKey, selectPointsSystemForNetworkAsset],
  (_networkAssetKey, pointSystems) => {
    return pointSystems.map((pointSystem) => pointSystem.key)
  }
)

/////////////////////////////////////////////////////////////////////
// Chain dropdown menu
/////////////////////////////////////////////////////////////////////

// SHOULD memoize: Returns a new array of objects; memoization avoids unnecessary recalculations.
export const selectSourceChains = createSelector(
  [selectNetworkAssetConfig],
  (networkAssetConfig): (Chain & { key: ChainKey })[] => {
    if (!networkAssetConfig) return []
    return Object.values(networkAssetConfig.sourceChains).map((sourceChainConfig) => {
      const chainConfig = chainsConfig[sourceChainConfig.chain as ChainKey]
      return { key: sourceChainConfig.chain as ChainKey, ...chainConfig }
    })
  }
)

export const selectRedeemSourceChains = createSelector(
  [selectNetworkAssetConfig],
  (networkAssetConfig): (Chain & { key: ChainKey })[] => {
    if (!networkAssetConfig) return []
    return Object.values(networkAssetConfig.redeem.redemptionSourceChains || {}).map((redemptionChainConfig) => {
      const chainConfig = chainsConfig[redemptionChainConfig.chain]
      return { key: redemptionChainConfig.chain, ...chainConfig }
    })
  }
)

export const selectRedeemDestinationChains = createSelector(
  [selectNetworkAssetConfig],
  (networkAssetConfig): (Chain & { key: ChainKey })[] => {
    if (!networkAssetConfig) return []
    return Object.values(networkAssetConfig.redeem.redemptionDestinationChains || {}).map((redemptionChainConfig) => {
      const chainConfig = chainsConfig[redemptionChainConfig.chain as ChainKey]
      return { key: redemptionChainConfig.chain as ChainKey, ...chainConfig }
    })
  }
)

export const selectExplorerBaseUrl = (state: RootState) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const sourceChainKey = selectSourceChainKey(state)
  const explorerBaseUrl = selectTransactionExplorerUrl(state)

  // There are two ways to get the explorer base url currently:
  // 1. From the transaction explorer url
  // 2. From the network asset config
  // Eventually we will make it to where this comes from only one place.
  if (!explorerBaseUrl) {
    const sourceChainKeyConfig = networkAssetConfig?.sourceChains[sourceChainKey as ChainKey]
    return sourceChainKeyConfig?.explorerBaseUrl || null
  } else {
    return explorerBaseUrl
  }
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectSourceChainId = (state: RootState): number | null => {
  const sourceChainKey = selectSourceChainKey(state)
  const chain = chainsConfig[sourceChainKey as ChainKey]
  return chain && chain.id ? chain.id : null
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectRedemptionSourceChainId = (state: RootState): number | null => {
  const sourceChainKey = selectRedemptionSourceChainKey(state)
  if (!sourceChainKey) return null
  const chain = chainsConfig[sourceChainKey as ChainKey]
  return chain.id || null
}

// DO NOT memoize: Direct lookup; returns a value from configuration.
export const selectDestinationChainId = (state: RootState): number | null => {
  const destinationChainKey = selectRedemptionDestinationChainKey(state)
  // Return null if destinationChainKey is null/undefined
  if (!destinationChainKey) return null
  const chain = chainsConfig[destinationChainKey as ChainKey]
  return chain?.id || null
}

export const selectIsBridgeRequired = (state: RootState): boolean => {
  const sourceRedemptionChainKey = selectRedemptionSourceChainKey(state)
  const destinationRedemptionChainKey = selectRedemptionDestinationChainKey(state)

  // Return false if either chain key is null/undefined
  if (!sourceRedemptionChainKey || !destinationRedemptionChainKey) {
    return false
  }

  // Return true if chains are different, false if they're the same
  return sourceRedemptionChainKey !== destinationRedemptionChainKey
}

// SHOULD memoize: Returns a new array; memoization avoids returning new references.
export const selectSourceTokens = createSelector(
  [selectNetworkAssetConfig, selectSourceChainKey],
  (chainConfig, sourceChain): TokenKey[] => {
    return chainConfig?.sourceTokens[sourceChain as ChainKey] || []
  }
)

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectSourceTokenKey = (state: RootState): TokenKey | null => {
  const bridgesState = selectBridgesState(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const sourceChainKey = selectSourceChainKey(state)
  if (!networkAssetConfig) return null
  return bridgesState.selectedSourceToken || networkAssetConfig?.sourceTokens[sourceChainKey as ChainKey]?.[0] || null
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectDepositAssetAddress = (state: RootState) => {
  const depositAssetTokenKey = selectSourceTokenKey(state)
  const sourceChainKey = selectSourceChainKey(state)
  if (!depositAssetTokenKey || !sourceChainKey) return null
  return tokensConfig[depositAssetTokenKey]?.addresses[sourceChainKey as ChainKey]
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectTokenAddressByTokenKey = (state: RootState, tokenKey: TokenKey) => {
  const sourceChainKey = selectSourceChainKey(state)
  return tokensConfig[tokenKey]?.addresses[sourceChainKey as ChainKey]
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectRedemptionTokenAddressByTokenKey = (state: RootState, tokenKey: TokenKey) => {
  const redemptionDestinationChainKey = selectRedemptionDestinationChainKey(state)
  return tokensConfig[tokenKey]?.addresses[redemptionDestinationChainKey as ChainKey]
}

// SHOULD memoize: Returns a new array; memoization avoids returning new references.
export const selectReceiveTokens = createSelector(
  [selectNetworkAssetConfig, selectRedemptionDestinationChainKey],
  (chainConfig, redemptionDestinationChainKey): TokenKey[] => {
    const wantTokens = chainConfig?.redeem.wantTokens[redemptionDestinationChainKey as ChainKey]
    // Get the keys of the want tokens object instead of the array directly
    return wantTokens ? (Object.keys(wantTokens) as TokenKey[]) : []
  }
)

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectReceiveTokenKey = (state: RootState): TokenKey => {
  const bridgesState = selectBridgesState(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const tokenKeys = selectReceiveTokens(state)
  if (!networkAssetConfig) return tokenKeys[0]
  return bridgesState.selectedReceiveToken || tokenKeys[0]
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectNativeAsset = (state: RootState) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const coinGeckoAssetId = networkAssetConfig?.nativeCurrency
  return coinGeckoAssetId
}
/////////////////////////////////////////////////////////////////////
// Deposit amount input
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectSolanaAddress = (state: RootState) => {
  return state.networkAssets.solanaAddress.trim()
}

// SHOULD memoize: Returns a new array; memoization avoids unnecessary recalculations.
export const selectSolanaAddressBytes32 = createSelector([selectSolanaAddress], (solanaAddress) => {
  const decodedAddress = bs58.decode(solanaAddress)
  const recipientBytes32 = toHex(decodedAddress, { size: 32 })
  return recipientBytes32
})

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectSolanaAddressError = (state: RootState): string | null => {
  const solanaAddress = selectSolanaAddress(state)
  const isEmpty = solanaAddress.trim().length === 0
  const isValid = isValidSolanaAddress(solanaAddress)
  if (!isEmpty && !isValid) {
    return 'Invalid Solana Address'
  }
  return null
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectDepositAmount = (state: RootState): string => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.depositAmount
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectDepositAmountAsBigInt = (state: RootState): bigint => {
  const depositAmountAsString = selectDepositAmount(state)
  if (!depositAmountAsString || depositAmountAsString.trim() === '') return BigInt(0)
  return BigInt(convertToDecimals(depositAmountAsString, 18))
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectShouldIgnoreBalance = (state: RootState) => {
  const sourceChainKey = selectSourceChainKey(state)
  return sourceChainKey === ChainKey.ETHEREUM
}

// SHOULD memoize: Memoization avoids unnecessary recalculations from hasMoreThanNSignificantDigits function.
export const selectInputError = createSelector(
  [
    selectNetworkAssetFromRoute,
    selectDepositAmount,
    selectSourceChainKey,
    selectSourceTokenKey,
    selectBalances,
    selectShouldIgnoreBalance,
  ],
  (networkAssetKey, inputValue, chainKeyFromChainSelector, selectedTokenKey, balances, shouldIgnoreBalance) => {
    // Special case just for tETH.
    // The tETH token on solana is limited to 9 decimals so the user input will
    // also be limited to 9 decimals.
    // NOTE: If in the future other tokens also require this check, come up
    // with a more dynamic solution.
    if (networkAssetKey === TokenKey.TETH) {
      if (hasMoreThanNSignificantDigits(inputValue, 9)) {
        return 'tETH only supports 9 significant digits'
      }
    }

    if (shouldIgnoreBalance) return null
    if (!selectedTokenKey) return null
    if (!chainKeyFromChainSelector) return null
    const tokenBalance = balances[selectedTokenKey]?.[chainKeyFromChainSelector]
    if (!tokenBalance) return null
    const tokenBalanceAsNumber = parseFloat(bigIntToNumberAsString(BigInt(tokenBalance), { maximumFractionDigits: 18 }))
    if (tokenBalanceAsNumber === null) return null

    if (parseFloat(inputValue) > tokenBalanceAsNumber) {
      return 'Insufficient balance'
    } else {
      return null
    }
  }
)

/////////////////////////////////////////////////////////////////////
// Redeem amount input
/////////////////////////////////////////////////////////////////////
// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectRedeemAmount = (state: RootState): string => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.redeemAmount
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectRedeemAmountAsBigInt = (state: RootState): bigint => {
  const withdrawAmountAsString = selectRedeemAmount(state)
  if (!withdrawAmountAsString || withdrawAmountAsString.trim() === '') return BigInt(0)
  return BigInt(convertToDecimals(withdrawAmountAsString, 18))
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectReceiveAmount = (state: RootState): string => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.redeemAmount
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectReceiveAmountAsBigInt = (state: RootState): bigint => {
  const receiveAmountAsString = selectReceiveAmount(state)
  if (!receiveAmountAsString || receiveAmountAsString.trim() === '') return BigInt(0)
  return BigInt(convertToDecimals(receiveAmountAsString, 18))
}

/////////////////////////////////////////////////////////////////////
// Bridge Rate
// Used to calculate the destination amount based on the deposit amount
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Returns a value directly from state.
export const selectTokenRateInQuote = (state: RootState) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.tokenRate.data
}

// DO NOT memoize: Returns a value directly from state.
export const selectTokenRateInQuoteLoading = (state: RootState) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.tokenRate.loading
}

/////////////////////////////////////////////////////////////////////
// Balance
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Returns a value directly from state.
export const selectSelectedTokenBalance = (state: RootState) => {
  const sourceChainKey = selectSourceChainKey(state)
  const sourceTokenKey = selectSourceTokenKey(state)
  const balances = selectBalances(state)
  if (!sourceChainKey || !sourceTokenKey) return null
  return balances[sourceTokenKey]?.[sourceChainKey] || null
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectWalletHasEnoughBalance = (state: RootState) => {
  const selectedTokenBalance = selectSelectedTokenBalance(state)
  const depositAmountAsBigInt = selectDepositAmountAsBigInt(state)
  if (selectedTokenBalance === null) return false
  return BigInt(selectedTokenBalance) >= depositAmountAsBigInt
}

/////////////////////////////////////////////////////////////////////
// Preview Fee
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Simple state access; should be a plain function.
export const selectPreviewFee = (state: RootState): string | null => state.networkAssets.previewFee.data

// DO NOT memoize: Simple state access; should be a plain function.
export const selectPreviewFeeLoading = (state: RootState) => state.networkAssets.previewFee.loading

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectPreviewFeeAsBigInt = (state: RootState): bigint => {
  const previewFee = selectPreviewFee(state)
  return previewFee ? BigInt(previewFee) : BigInt(0)
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectFormattedPreviewFee = (state: RootState): string => {
  const previewFee = selectPreviewFeeAsBigInt(state)
  let price = selectUsdPerEthRate(state)
  if (!previewFee) {
    price = BigInt(0)
  }
  const formattedPreviewFee = convertToUsd(previewFee, price, {
    usdDigits: 2,
  })
  return formattedPreviewFee
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectShouldTriggerPreviewFee = (state: RootState): boolean => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const networkAssetKey = selectNetworkAssetFromRoute(state)
  const inputAmount = selectDepositAmount(state)
  const error = selectInputError(state)
  const layerZeroChainSelector = selectLayerZeroChainSelector(state)
  const hyperlaneChainSelector = selectHyperlaneChainSelector(state)
  const sourceChainKey = selectSourceChainKey(state)
  const address = selectAddress(state)

  const isConnected = !!address
  // Will use the bridge if the source is Ethereum and the network is not deployed on Ethereum
  const bridgingToL2 = sourceChainKey === ChainKey.ETHEREUM && networkAssetConfig?.deployedOn !== ChainKey.ETHEREUM
  const isTeth = networkAssetKey === TokenKey.TETH
  // Check if either chain selector is available
  const hasChainSelector = layerZeroChainSelector !== null || hyperlaneChainSelector !== null
  const isNotEmpty = inputAmount.trim().length > 0
  const isGreaterThanZero = parseFloat(inputAmount) > 0
  const hasNoError = !error

  return isConnected && (bridgingToL2 || isTeth) && hasChainSelector && isNotEmpty && isGreaterThanZero && hasNoError
}

/////////////////////////////////////////////////////////////////////
// Deposit Selectors
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Returns a value directly from state.
export const selectDepositPending = (state: RootState) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.deposit.pending
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectDepositDisabled = (state: RootState): boolean => {
  const from = selectDepositAmount(state)
  const error = selectInputError(state)
  const pending = selectDepositPending(state)
  const previewFee = selectPreviewFee(state)
  const networkAssetKey = selectNetworkAssetFromRoute(state)
  const solanaAddress = selectSolanaAddress(state)
  const solanaAddressError = selectSolanaAddressError(state)

  const shouldTriggerPreviewFee = selectShouldTriggerPreviewFee(state)
  const isEmpty = from.trim().length === 0
  const isLessThanOrEqualToZero = parseFloat(from) <= 0
  const isError = !!error
  const isPending = !!pending
  const isPreviewFeeApplicableButNotReady = shouldTriggerPreviewFee && previewFee === null
  const isOnTethAndAddressEmpty = networkAssetKey === TokenKey.TETH && solanaAddress.trim() === ''
  const isOnTethAndAddressError = networkAssetKey === TokenKey.TETH && solanaAddressError !== null

  return (
    isEmpty ||
    isLessThanOrEqualToZero ||
    isError ||
    isPending ||
    isPreviewFeeApplicableButNotReady ||
    isOnTethAndAddressEmpty ||
    isOnTethAndAddressError
  )
}

// SHOULD memoize: Returns a new object; memoization avoids unnecessary recalculations.
export const selectDepositBridgeData = createSelector(
  [selectLayerZeroChainSelector, selectHyperlaneChainSelector, selectAddress],
  (layerZeroChainSelector, hyperlaneChainSelector, userAddress): CrossChainTellerBase.BridgeData | null => {
    if (!userAddress) return null
    const chainSelector = hyperlaneChainSelector ? hyperlaneChainSelector : layerZeroChainSelector
    return {
      chainSelector: chainSelector,
      destinationChainReceiver: userAddress,
      bridgeFeeToken: tokensConfig[TokenKey.ETH].addresses[ChainKey.ETHEREUM] as Address,
      messageGas: 100000,
      data: '',
    }
  }
)

/////////////////////////////////////////////////////////////////////
// Withdrawal Selectors
/////////////////////////////////////////////////////////////////////

// SHOULD memoize: Returns a new object; memoization avoids unnecessary recalculations.
export const selectRedeemBridgeData = createSelector(
  [selectRedeemLayerZeroChainSelector, selectRedeemHyperlaneChainSelector, selectAddress],
  (redeemLayerZeroChainSelector, redeemHyperlaneChainSelector, userAddress): BridgeData | null => {
    if (!userAddress) return null
    const chainSelector = redeemHyperlaneChainSelector ? redeemHyperlaneChainSelector : redeemLayerZeroChainSelector
    console.log('redeemBridgeData', chainSelector, userAddress)
    return {
      chainSelector: chainSelector,
      destinationChainReceiver: userAddress,
      bridgeFeeToken: nativeAddress,
      messageGas: BigInt(100000),
      data: '0x',
    }
  }
)

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectWantAssetAddress = (state: RootState) => {
  const wantTokenKey = selectReceiveTokenKey(state)
  const destinationChainKey = selectRedemptionDestinationChainKey(state)
  if (!wantTokenKey || !destinationChainKey) return null
  return tokensConfig[wantTokenKey]?.addresses[destinationChainKey as ChainKey]
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
// Returns withdrawal fee for selected receive token
export const selectWithdrawalFee = (state: RootState): number => {
  const chainConfig = selectNetworkAssetConfig(state)
  const redemptionDestinationChainKey = selectRedemptionDestinationChainKey(state)
  const receiveTokenKey = selectReceiveTokenKey(state)

  if (!chainConfig || !redemptionDestinationChainKey || !receiveTokenKey) {
    return defaultWithdrawalFee
  }

  const withdrawalFee =
    chainConfig.redeem.wantTokens[redemptionDestinationChainKey as ChainKey]?.[receiveTokenKey]?.withdrawalFee
  // Allow 0 but use default for null/undefined
  return withdrawalFee !== null && withdrawalFee !== undefined ? withdrawalFee : defaultWithdrawalFee
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectWithdrawalFeeAsBigInt = (state: RootState): bigint => {
  const withdrawalFee = selectWithdrawalFee(state)
  return withdrawalFee ? BigInt(withdrawalFee * WAD.number) : BigInt(0)
}

export const selectWithdrawalSourceExplorerBaseUrl = (state: RootState) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const redemptionSourceChainKey = selectRedemptionSourceChainKey(state)
  const withdrawalSourceExplorerBaseUrl =
    networkAssetConfig?.redeem.redemptionSourceChains[redemptionSourceChainKey as ChainKey]?.explorerBaseUrl
  return withdrawalSourceExplorerBaseUrl
}

export const selectWithdrawalDestinationExplorerBaseUrl = (state: RootState) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const redemptionDestinationChainKey = selectRedemptionDestinationChainKey(state)
  const withdrawalDestinationExplorerBaseUrl =
    networkAssetConfig?.redeem.redemptionDestinationChains[redemptionDestinationChainKey as ChainKey]?.explorerBaseUrl
  return withdrawalDestinationExplorerBaseUrl
}

// Fun Selectors
/////////////////////////////////////////////////////////////////////

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectShouldUseFunCheckout = (state: RootState) => {
  const walletHasEnoughBalance = selectWalletHasEnoughBalance(state)
  const sourceChainKey = selectSourceChainKey(state)
  const isFunkitEnabled = USE_FUNKIT
  const networkShouldUseFun = sourceChainKey === ChainKey.ETHEREUM
  return isFunkitEnabled && !walletHasEnoughBalance && networkShouldUseFun
}

// SHOULD memoize: Returns a new object; memoization avoids unnecessary recalculations.
export const selectDepositAndBridgeCheckoutParams = createSelector(
  [selectSourceTokenKey, selectDepositAssetAddress, selectDepositAmount],
  (depositAssetTokenKey, depositAssetAddress, fromAmount) => {
    // Constants
    const VERB = 'Buy'

    // Values
    const fromTokenInfo = depositAssetTokenKey ? tokensConfig[depositAssetTokenKey] : null

    // Null checks
    if (!depositAssetAddress) {
      return null
    }

    // Build the checkout params
    return {
      modalTitle: `${VERB} ${fromTokenInfo?.name}`,
      iconSrc: `/assets/svgs/token-${fromTokenInfo?.key}.svg`,
      actionsParams: [],
      targetChain: '1',
      targetAsset: depositAssetAddress as `0x${string}`,
      targetAssetAmount: parseFloat(fromAmount),
      targetAssetTicker: fromTokenInfo?.name,
      checkoutItemTitle: `${VERB} ${fromTokenInfo?.name}`,
      checkoutItemDescription: `${VERB} ${fromTokenInfo?.name}`,
      checkoutItemAmount: parseFloat(fromAmount),
      expirationTimestampMs: 3600000,
      disableEditing: false,
    }
  }
)
