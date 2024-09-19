import { CrossChainTellerBase } from '@/api/contracts/Teller/previewFee'
import { hardcodedApy } from '@/config/constants'
import { networksConfig } from '@/config/networks'
import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { NetworkAsset } from '@/types/Chain'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber, bigIntToNumberAsString } from '@/utils/bigint'
import { currencySwitch } from '@/utils/currency'
import { abbreviateNumber, convertToDecimals, numberToPercent } from '@/utils/number'
import { createSelector } from 'reselect'
import { selectAddress } from '../account'
import { selectBalances } from '../balance'
import { selectNetworkKey } from '../chain'
import { selectPriceLoading, selectUsdPerEthRate } from '../price'
import { selectNetworkAssetFromRoute } from '../router'
import { calculateApy } from './calculateApy'
import { Chain, chainsConfig } from '@/config/chains'
import { Address } from 'viem'
import { PointSystem } from '@/types/PointSystem'

const USE_FUNKIT = process.env.NEXT_PUBLIC_USE_FUNKIT === 'true'

/////////////////////////////////////////////////////////////////////
// Principal Selectors: Influences the result of many other selectors
/////////////////////////////////////////////////////////////////////
export const selectBridgesState = (state: RootState) => state.networkAssets
export const selectSourceChainKey = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceChain)

/////////////////////////////////////////////////////////////////////
// Config Selectors
/////////////////////////////////////////////////////////////////////
export const selectNetworkConfig = createSelector([selectNetworkKey], (networkKey) => {
  if (!networkKey) return null
  return networksConfig[networkKey]
})
export const selectNetworkAssetConfig = createSelector(
  [selectNetworkConfig, selectNetworkAssetFromRoute],
  (networkConfig, networkAsset): NetworkAsset | null => {
    if (!networkAsset || !networkConfig) return null
    const networkAssetConfig = networkConfig.assets[networkAsset] as NetworkAsset
    return networkAssetConfig
  }
)
export const selectNetworkAssetConfigByKey = (tokenKey: TokenKey) => {
  return createSelector([selectNetworkConfig], (networkConfig) => {
    if (!networkConfig) return null
    const networkAsset = networkConfig.assets[tokenKey as TokenKey] as NetworkAsset
    return { ...networkAsset, key: tokenKey }
  })
}

export const selectAllNetworkAssetKeys = createSelector([selectNetworkConfig], (networkConfig): TokenKey[] => {
  if (!networkConfig) return []
  return Object.keys(networkConfig.assets) as TokenKey[]
})
export const selectAvailableNetworkAssetKeys = createSelector(
  [selectAllNetworkAssetKeys, selectNetworkConfig],
  (networkAssetKeys, networkConfig): TokenKey[] => {
    if (!networkConfig) return []
    return networkAssetKeys.filter((key) => networkConfig.assets[key]?.comingSoon !== true)
  }
)

export const selectContractAddressByName = (name: string) =>
  createSelector([selectNetworkAssetConfig], (networkAssetConfig) => {
    return networkAssetConfig?.contracts[name as keyof typeof networkAssetConfig.contracts]
  })
export const selectLayerZeroChainSelector = createSelector([selectNetworkAssetConfig], (networkAssetConfig): number => {
  return networkAssetConfig?.layerZeroChainSelector || 0
})
export const selectReceiveOnChain = createSelector(
  [selectNetworkAssetConfig, selectNetworkConfig],
  (networkAssetConfig) => {
    if (!networkAssetConfig) return null
    return networkAssetConfig.receiveOn
  }
)

/////////////////////////////////////////////////////////////////////
// Nav Drawer
/////////////////////////////////////////////////////////////////////
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
// TVL
/////////////////////////////////////////////////////////////////////
export const selectTvlLoading = (state: RootState) => state.networkAssets.tvl.loading
export const selectNetworkAssetTvlByKey = (tokenKey: TokenKey) =>
  createSelector([selectBridgesState], (bridgesState) => {
    const tvl = bridgesState.tvl.data[tokenKey]
    if (!tvl) return BigInt(0)
    return BigInt(tvl.toString())
  })
export const selectActiveChainTvl = createSelector(
  [selectBridgesState, selectNetworkAssetFromRoute],
  (bridgesState, tokenKey) => {
    if (tokenKey === null) return null
    const tvl = bridgesState.tvl.data[tokenKey] || null
    if (tvl === null) return null
    return BigInt(tvl.toString())
  }
)
export const selectFormattedNetworkAssetTvlByKey = (tokenKey: TokenKey) =>
  createSelector([selectNetworkAssetTvlByKey(tokenKey), selectUsdPerEthRate], (tvl, price) => {
    if (!tvl) return '-'
    const tvlInUsdAsBigInt = (tvl * price) / BigInt(1e8)
    const tvlInUsdAsNumber = bigIntToNumber(tvlInUsdAsBigInt)
    return abbreviateNumber(tvlInUsdAsNumber)
  })
export const selectActiveFormattedNetworkAssetTvl = createSelector(
  [selectActiveChainTvl, selectUsdPerEthRate],
  (tvl, price) => {
    if (!tvl) return '-'
    const tvlInUsdAsBigInt = (tvl * price) / BigInt(1e8)
    const tvlInUsdAsNumber = bigIntToNumber(tvlInUsdAsBigInt)
    return abbreviateNumber(tvlInUsdAsNumber)
  }
)

/////////////////////////////////////////////////////////////////////
// APY
/////////////////////////////////////////////////////////////////////

export const selectApyTokenKeys = (networkAssetKey: TokenKey) =>
  createSelector([selectNetworkAssetConfigByKey(networkAssetKey)], (networkAssetConfig) => {
    if (!networkAssetConfig) return []
    return Object.keys(networkAssetConfig.apys) as TokenKey[]
  })

export const selectNetworkAssetApy = (networkAssetKey: TokenKey, apyTokenKey: TokenKey) =>
  createSelector(
    [selectNetworkAssetConfigByKey(networkAssetKey), selectNetworkAssetTvlByKey(networkAssetKey), selectUsdPerEthRate],
    (networkAssetConfig, tvlInEth, usdPerEthRate) => {
      const networkAssetApyData = networkAssetConfig?.apys[apyTokenKey]
      if (!networkAssetApyData) return null
      // tvlInEth is 0
      const apy = calculateApy(networkAssetApyData, tvlInEth, usdPerEthRate)
      return apy
    }
  )

export const selectFormattedTokenApy = (networkAssetKey: TokenKey, apyTokenKey: TokenKey) =>
  createSelector([selectNetworkAssetApy(networkAssetKey, apyTokenKey)], (tokenApy): string | null => {
    if (tokenApy === null) return null
    return numberToPercent(tokenApy)
  })

export const selectTokenApyLoading = createSelector(
  [selectTvlLoading, selectPriceLoading],
  (tvlLoading, priceLoading) => {
    return tvlLoading || priceLoading
  }
)

export const selectNetApy = (tokenKey: TokenKey) =>
  createSelector(
    [selectNetworkConfig, selectNetworkAssetTvlByKey(tokenKey), selectUsdPerEthRate],
    (networkConfig, tvlInEth, usdPerEthRate) => {
      const networkAssetConfig = networkConfig?.assets[tokenKey]
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

export const selectFormattedNetApy = (networkAssetKey: TokenKey) =>
  createSelector([selectNetApy(networkAssetKey)], (netApy) => {
    if (!netApy) return '0.0%'
    if (netApy >= 250) {
      return '>250%'
    }
    return numberToPercent(netApy)
  })

export const selectShouldShowMessageForLargeNetApy = (networkAssetKey: TokenKey) =>
  createSelector([selectNetApy(networkAssetKey)], (netApy) => {
    if (!netApy) return false
    if (netApy >= 250) {
      return true
    }
    return false
  })

export const selectNetApyLoading = createSelector(
  [selectTvlLoading, selectPriceLoading],
  (tvlLoading, priceLoading) => {
    return tvlLoading || priceLoading
  }
)

/////////////////////////////////////////////////////////////////////
// Rewards & Points
/////////////////////////////////////////////////////////////////////
export const selectPointsSystemForNetworkAsset = (networkAssetKey: TokenKey) =>
  createSelector([selectNetworkConfig], (networkConfig) => {
    const networkAssetConfig = networkConfig?.assets[networkAssetKey]
    return networkAssetConfig?.points || []
  })
export const selectPointSystemKeysForNetworkAsset = (networkAssetKey: TokenKey) =>
  createSelector([selectPointsSystemForNetworkAsset(networkAssetKey)], (pointSystems) => {
    return pointSystems.map((pointSystem) => pointSystem.key)
  })

/////////////////////////////////////////////////////////////////////
// Chain dropdown menu
/////////////////////////////////////////////////////////////////////
export const selectSourceChains = createSelector(
  [selectNetworkAssetConfig],
  (networkAssetConfig): (Chain & { key: ChainKey })[] => {
    if (!networkAssetConfig) return []
    return networkAssetConfig.sourceChains.map((chainKey) => {
      const chain = chainsConfig[chainKey as ChainKey]
      return { key: chainKey as ChainKey, ...chain }
    })
  }
)

export const selectSourceChainId = createSelector([selectSourceChainKey], (sourceChainKey): number | null => {
  const chain = chainsConfig[sourceChainKey as ChainKey]
  return chain.id || null
})

// Token dropdown menu
export const selectSourceTokens = createSelector(
  [selectNetworkAssetConfig, selectSourceChainKey],
  (chainConfig, sourceChain): TokenKey[] => {
    return chainConfig?.sourceTokens[sourceChain as ChainKey] || []
  }
)
export const selectSourceTokenKey = createSelector(
  [selectBridgesState, selectNetworkAssetConfig, selectSourceChainKey],
  (bridgesState, networkAssetConfig, sourceChainKey): TokenKey | null => {
    if (!networkAssetConfig) return null
    return bridgesState.selectedSourceToken || networkAssetConfig?.sourceTokens[sourceChainKey as ChainKey]?.[0] || null
  }
)
export const selectDepositAssetAddress = createSelector(
  [selectSourceTokenKey, selectSourceChainKey],
  (depositAssetTokenKey, sourceChainKey) => {
    if (!depositAssetTokenKey || !sourceChainKey) return null
    return tokensConfig[depositAssetTokenKey]?.addresses[sourceChainKey as ChainKey]
  }
)
export const selectTokenAddressByTokenKey = (tokenKey: TokenKey) =>
  createSelector([selectSourceChainKey], (sourceChainKey) => {
    return tokensConfig[tokenKey]?.addresses[sourceChainKey as ChainKey]
  })

/////////////////////////////////////////////////////////////////////
// Deposit amount input
/////////////////////////////////////////////////////////////////////
export const selectDepositAmount = createSelector([selectBridgesState], (bridgesState): string => {
  return bridgesState.depositAmount
})
export const selectDepositAmountAsBigInt = createSelector([selectDepositAmount], (depositAmountAsString): bigint => {
  if (!depositAmountAsString || depositAmountAsString.trim() === '') return BigInt(0)
  return BigInt(convertToDecimals(depositAmountAsString, 18))
})

export const selectShouldIgnoreBalance = createSelector([selectSourceChainKey], (sourceChainKey) => {
  return sourceChainKey === ChainKey.ETHEREUM
})

export const selectInputError = createSelector(
  [
    selectDepositAmount,
    selectSourceChainKey,
    selectNetworkAssetFromRoute,
    selectSourceTokenKey,
    selectBalances,
    selectShouldIgnoreBalance,
  ],
  (inputValue, chainKeyFromChainSelector, chainKeyFromRoute, selectedTokenKey, balances, shouldIgnoreBalance) => {
    if (shouldIgnoreBalance) return null
    if (!selectedTokenKey) return null
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
// Bridge Rate
// Used to calculate the destination amount based on the deposit amount
/////////////////////////////////////////////////////////////////////
export const selectTokenRateInQuote = createSelector([selectBridgesState], (bridgesState) => {
  return bridgesState.tokenRate.data
})
export const selectTokenRateInQuoteLoading = createSelector([selectBridgesState], (bridgesState) => {
  return bridgesState.tokenRate.loading
})

/////////////////////////////////////////////////////////////////////
// Balance
/////////////////////////////////////////////////////////////////////
export const selectSelectedTokenBalance = createSelector(
  [selectSourceChainKey, selectSourceTokenKey, selectBalances],
  (sourceChainKey, sourceTokenKey, balances) => {
    if (!sourceChainKey || !sourceTokenKey) return null
    return balances[sourceTokenKey]?.[sourceChainKey] || null
  }
)

export const selectWalletHasEnoughBalance = createSelector(
  [selectSelectedTokenBalance, selectDepositAmountAsBigInt],
  (selectedTokenBalance, depositAmountAsBigInt) => {
    if (selectedTokenBalance === null) return false
    return BigInt(selectedTokenBalance) >= depositAmountAsBigInt
  }
)

/////////////////////////////////////////////////////////////////////
// Preview Fee
/////////////////////////////////////////////////////////////////////
export const selectPreviewFee = (state: RootState): string | null => state.networkAssets.previewFee.data
export const selectPreviewFeeLoading = (state: RootState) => state.networkAssets.previewFee.loading
export const selectPreviewFeeAsBigInt = createSelector([selectPreviewFee], (previewFee): bigint => {
  return previewFee ? BigInt(previewFee) : BigInt(0)
})
export const selectFormattedPreviewFee = createSelector(
  [selectPreviewFeeAsBigInt, selectUsdPerEthRate],
  (previewFee, price): string => {
    if (!previewFee) {
      price = BigInt(0)
    }
    const formattedPreviewFee = currencySwitch(previewFee, price, {
      usdDigits: 2,
      ethDigits: 7,
    })
    return formattedPreviewFee
  }
)
export const selectShouldTriggerPreviewFee = createSelector(
  [selectDepositAmount, selectInputError, selectLayerZeroChainSelector, selectSourceChainKey, selectAddress],
  (inputAmount, error, layerZeroChainSelector, sourceChainKey, address): boolean => {
    const isConnected = !!address
    const willUseBridge = sourceChainKey === ChainKey.ETHEREUM
    const hasLayerZeroChainSelector = layerZeroChainSelector !== null
    const isNotEmpty = inputAmount.trim().length > 0
    const isGreaterThanZero = parseFloat(inputAmount) > 0
    const hasNoError = !error
    return isConnected && willUseBridge && hasLayerZeroChainSelector && isNotEmpty && isGreaterThanZero && hasNoError
  }
)

/////////////////////////////////////////////////////////////////////
// Desposit Selectors
/////////////////////////////////////////////////////////////////////
export const selectDepositPending = createSelector([(state: RootState) => state], (state) => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.deposit.pending
})
export const selectDepositDisabled = createSelector(
  [selectDepositAmount, selectInputError, selectDepositPending, selectPreviewFee, selectShouldTriggerPreviewFee],
  (from, error, pending, previewFee, shouldTriggerPreviewFee): boolean => {
    const isEmpty = from.trim().length === 0
    const isLessThanOrEqualToZero = parseFloat(from) <= 0
    const isError = !!error
    const isPending = !!pending
    const isPreviewFeeApplicableButNotReady = shouldTriggerPreviewFee && previewFee === null
    return isEmpty || isLessThanOrEqualToZero || isError || isPending || isPreviewFeeApplicableButNotReady
  }
)
export const selectDepositBridgeData = createSelector(
  [selectLayerZeroChainSelector, selectAddress],
  (layerZeroChainSelector, userAddress): CrossChainTellerBase.BridgeData | null => {
    if (!userAddress) return null
    return {
      chainSelector: layerZeroChainSelector,
      destinationChainReceiver: userAddress,
      bridgeFeeToken: tokensConfig[TokenKey.ETH].addresses[ChainKey.ETHEREUM] as Address,
      messageGas: 100000,
      data: '',
    }
  }
)

/////////////////////////////////////////////////////////////////////
// Fun Selectors
/////////////////////////////////////////////////////////////////////
export const selectShouldUseFunCheckout = createSelector(
  [selectWalletHasEnoughBalance, selectSourceChainKey],
  (walletHasEnoughBalance, sourceChainKey) => {
    const isFunkitEnabled = USE_FUNKIT
    const isSourceChainEthereum = sourceChainKey === ChainKey.ETHEREUM
    return isFunkitEnabled && !walletHasEnoughBalance && isSourceChainEthereum
  }
)

export const selectDepositAndBridgeCheckoutParams = (minimumMint: bigint) =>
  createSelector(
    [selectSourceTokenKey, selectDepositAssetAddress, selectAddress, selectDepositAmount],
    (depositAssetTokenKey, depositAssetAddress, userAddress, fromAmount) => {
      // Constants
      const VERB = 'Buy'

      // Values
      const fromTokenInfo = depositAssetTokenKey ? tokensConfig[depositAssetTokenKey] : null

      // Null checks
      if (!userAddress || !depositAssetAddress) {
        return null
      }

      // Build the checkout params
      return {
        modalTitle: `${VERB} ${fromTokenInfo?.name}`,
        iconSrc: `/assets/svgs/token-${fromTokenInfo?.key}.svg`,
        actionsParams: [],
        targetChain: '1',
        targetAsset: depositAssetAddress,
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
