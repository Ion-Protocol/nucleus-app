import { ChainKey, chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectCurrency } from '@/store/slices/currency'
import { Bridge } from '@/types/Bridge'
import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'
import { WAD } from '@/utils/bigint'
import { currencySwitch } from '@/utils/currency'
import { createSelector } from 'reselect'
import { selectChainKey } from '../chain'
import { selectUsdPerEthRate } from '../price'
import { selectBridgeKeyFromRoute } from '../router'
import { BridgeData } from './initialState'

export const selectBridgesState = (state: RootState) => state.bridges
export const selectInputError = createSelector([selectBridgesState], (bridgesState) => bridgesState.inputError)
export const selectBridgesLoading = createSelector(
  [selectBridgesState],
  (bridgesState): boolean => bridgesState.overallLoading
)
export const selectSourceBridge = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceBridge)
export const selectDestinationBridge = createSelector(
  [selectBridgesState],
  (bridgesState) => bridgesState.destinationBridge
)

export const selectTvlLoading = (state: RootState) => state.bridges.tvlLoading
export const selectPreviewFeeLoading = (state: RootState) => state.bridges.previewFeeLoading

export const selectChainConfig = createSelector([selectChainKey], (chainKey) => {
  if (!chainKey) return null
  return chainsConfig[chainKey]
})

export const selectSourceBridgeChainId = createSelector(
  [selectSourceBridge, selectChainConfig],
  (sourceBridgeKey, chainConfig): number | null => {
    if (!sourceBridgeKey) return null
    if (sourceBridgeKey === BridgeKey.ETHEREUM) {
      return 1
    }
    return chainConfig?.bridges[sourceBridgeKey as BridgeKey]?.chainId || null
  }
)

export const selectChainKeyByChainId = (chainId: number | undefined) =>
  Object.keys(chainsConfig).find(
    (bridgeKey) => chainsConfig[bridgeKey as keyof typeof chainsConfig].id === chainId
  ) as BridgeKey | null

export const selectBridgeConfig = createSelector(
  [selectChainConfig, selectBridgeKeyFromRoute],
  (chainConfig, bridgeKey): (Bridge & { key: BridgeKey }) | null => {
    if (!bridgeKey || !chainConfig) return null
    const bridgeConfig = chainConfig.bridges[bridgeKey] as Bridge
    return { ...bridgeConfig, key: bridgeKey }
  }
)

export const selectSourceTokens = createSelector(
  [selectBridgeConfig, selectSourceBridge],
  (bridgeConfig, sourceBridge): TokenKey[] => {
    return bridgeConfig?.sourceTokens[sourceBridge as BridgeKey] || []
  }
)

export const selectTellerAddress = createSelector([selectBridgeConfig], (bridgeConfig): `0x${string}` | null => {
  return bridgeConfig?.contracts.teller || null
})

export const selectFeeTokenKey = createSelector([selectBridgeConfig], (bridgeConfig): TokenKey | null => {
  return bridgeConfig?.feeToken || null
})

export const selectFeeTokenAddress = createSelector(
  [selectFeeTokenKey, selectSourceBridge],
  (feeTokenKey, sourceBridgeKey): `0x${string}` | null => {
    if (!feeTokenKey || !sourceBridgeKey) return null
    const feeToken = tokensConfig[feeTokenKey as keyof typeof tokensConfig]
    return feeToken.chains[sourceBridgeKey]?.address || null
  }
)

export const selectBridgeConfigByKey = (bridgeKey: BridgeKey) => {
  return createSelector([selectChainConfig], (chainConfig) => {
    if (!chainConfig) return null
    const bridgeConfig = chainConfig.bridges[bridgeKey]
    return { ...bridgeConfig, key: bridgeKey }
  })
}

export const selectBridgesAsArray = createSelector(
  [selectChainConfig],
  (chainConfig): (Bridge & { key: BridgeKey })[] => {
    if (!chainConfig) return []
    return Object.keys(chainConfig.bridges).map((key) => ({
      key: key as BridgeKey,
      ...(chainConfig.bridges[key as BridgeKey] as Bridge),
    }))
  }
)

export const selectSourceBridges = createSelector(
  [selectBridgeConfig, selectChainConfig],
  (bridgeConfig, chainConfig) => {
    if (!bridgeConfig || !chainConfig || !bridgeConfig.sourceBridges) return []
    return bridgeConfig.sourceBridges.map((bridgeKey) => {
      let name = chainConfig.bridges[bridgeKey]?.name
      if (bridgeKey === BridgeKey.ETHEREUM) {
        name = 'Ethereum'
      }
      return { key: bridgeKey, name }
    })
  }
)

export const selectBridgeKeys = createSelector([selectChainConfig], (chainConfig): BridgeKey[] => {
  if (!chainConfig) return []
  return Object.keys(chainConfig.bridges) as BridgeKey[]
})

export const selectAvailableBridgeKeys = createSelector(
  [selectBridgeKeys, selectChainConfig],
  (bridgeKeys, chainConfig): BridgeKey[] => {
    if (!chainConfig) return []
    return bridgeKeys.filter((key) => chainConfig.bridges[key]?.comingSoon === false)
  }
)

export const selectBridgesData = createSelector([selectBridgesState], (bridgesState) => {
  return bridgesState.data
})

export const selectBridgeData = createSelector(
  [selectBridgesData, selectBridgeKeyFromRoute],
  (bridgesData, bridgeKeyFromUrl): BridgeData | null => {
    if (!bridgeKeyFromUrl) return null
    return bridgesData?.[bridgeKeyFromUrl] as BridgeData
  }
)

export const selectBridgeDataFromSourceChain = createSelector(
  [selectBridgesData, selectSourceBridge],
  (bridgesData, bridgeKeyFromSourceChain) => {
    if (!bridgeKeyFromSourceChain) return null
    return bridgesData?.[bridgeKeyFromSourceChain] as BridgeData
  }
)

/**
 * Selects the Total Value Locked (TVL) for a specific bridge key.
 *
 * @param key - The key of the bridge.
 * @returns The TVL for the specified bridge key, or `undefined` if not found.
 */
export const selectBridgeTvlByKey = (bridgeKey: BridgeKey) =>
  createSelector([selectBridgesData], (bridgesData) => {
    const tvl = bridgesData[bridgeKey].tvl.value
    if (!tvl) return BigInt(0)
    return BigInt(tvl)
  })

export const selectActiveBridgeTvl = createSelector(
  [selectBridgesData, selectBridgeKeyFromRoute],
  (bridgesData, bridgeKey) => {
    if (bridgeKey === null) return null
    const tvl = bridgesData[bridgeKey].tvl.value
    if (tvl === null) return null
    return BigInt(tvl)
  }
)

/**
 * Selects the formatted total value locked (TVL) for a specific bridge key.
 *
 * @param key - The bridge key.
 * @returns A selector function that returns the formatted TVL.
 */
export const selectFormattedBridgeTvlByKey = (bridgeKey: BridgeKey) =>
  createSelector(
    [selectBridgeTvlByKey(bridgeKey), selectUsdPerEthRate, selectCurrency, selectChainConfig],
    (tvl, price, currency, chainConfig) => {
      const bridgeConfig = chainConfig?.bridges[bridgeKey]
      const formattedTvl = currencySwitch(currency, tvl, price, { symbol: bridgeConfig?.networkSymbol })
      return formattedTvl || '-'
    }
  )

export const selectActiveFormattedBridgeTvl = createSelector(
  [selectActiveBridgeTvl, selectUsdPerEthRate, selectCurrency, selectBridgeConfig],
  (tvl, price, currency, bridgeConfig) => {
    const formattedTvl = currencySwitch(currency, tvl, price, { symbol: bridgeConfig?.networkSymbol })
    return formattedTvl || '-'
  }
)

export const selectAllBridgeKeys = createSelector([selectChainConfig], (chainConfig): BridgeKey[] => {
  if (!chainConfig) return []
  return Object.keys(chainConfig.bridges) as BridgeKey[]
})

/**
 * Selects the 'from' value of a bridge identified by the given key.
 *
 * @param state - The root state.
 * @param key - The key of the bridge.
 * @returns The 'from' value of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeFrom = createSelector([selectBridgeData], (bridgeData): string => {
  if (!bridgeData) return ''
  return bridgeData.from
})

/**
 * Retrieves the token of a specific bridge from the state.
 * @param state - The root state of the application.
 * @param bridgeKey - The key of the bridge.
 * @returns The token of the bridge, or undefined if the bridge does not exist.
 */
export const selectToTokenKeyForBridge = createSelector([selectBridgeData], (bridgeData): TokenKey | null => {
  if (!bridgeData) return null
  return bridgeData.selectedToToken
})

/**
 * Selects the `TokenKey` associated with a specific `BridgeKey` from the state.
 * If the `BridgeKey` does not exist in the state, it returns `null`.
 * If the `BridgeKey` exists but does not have a selected `TokenKey`, it returns the first `TokenKey` from the `sourceTokens` array in the `bridgesConfig`.
 *
 * @param state - The root state of the application.
 * @param bridgeKey - The key of the bridge.
 * @returns The selected `TokenKey` or `null`.
 */
export const selectFromTokenKeyForBridge = createSelector(
  [selectBridgeData, selectBridgeConfig, selectSourceBridge],
  (bridgeData, bridgeConfig, sourceBridge): TokenKey | null => {
    if (!bridgeData || !bridgeConfig) return null
    return bridgeData.selectedFromToken || bridgeConfig?.sourceTokens[sourceBridge as BridgeKey]?.[0] || null
  }
)

/**
 * Selects the deposit amount as a BigInt.
 *
 * @param selectBridgeFrom - The selector function to get the bridge from.
 * @param depositAmountAsString - The deposit amount as a string.
 * @returns The deposit amount as a BigInt.
 */
export const selectDepositAmountAsBigInt = createSelector([selectBridgeFrom], (depositAmountAsString): bigint => {
  if (!depositAmountAsString || depositAmountAsString.trim() === '') return BigInt(0)
  return BigInt(parseFloat(depositAmountAsString) * WAD.number)
})

/**
 * Retrieves the rate of a specific bridge from the state.
 *
 * @param state - The root state of the application.
 * @param key - The key of the bridge.
 * @returns The rate of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeRate = createSelector([selectBridgeData], (bridgeData): string | number | null => {
  if (!bridgeData) return null
  return bridgeData.rate.value
})

export const selectDepositPending = createSelector([(state: RootState) => state], (state) => {
  const bridges = selectBridgesState(state)
  return bridges.deposit.pending
})

export const selectDepositError = createSelector([(state: RootState) => state], (state) => {
  const bridges = selectBridgesState(state)
  return bridges.deposit.error
})

export const selectPreviewFee = (state: RootState): string | null => state.bridges.previewFee
export const selectPreviewFeeAsBigInt = createSelector([selectPreviewFee], (previewFee): bigint | null => {
  return previewFee ? BigInt(previewFee) : null
})

export const selectFormattedPreviewFee = createSelector(
  [selectPreviewFeeAsBigInt, selectUsdPerEthRate, selectCurrency, selectBridgeConfig],
  (previewFee, price, currency, bridgeConfig): string => {
    if (!previewFee) return '$0'
    const formattedPreviewFee = currencySwitch(currency, previewFee, price, {
      usdDigits: 2,
      ethDigits: 7,
      symbol: bridgeConfig?.networkSymbol,
    })
    return formattedPreviewFee || '$0'
  }
)

export const selectDepositDisabled = createSelector(
  [selectBridgeFrom, selectInputError, selectDepositPending],
  (from, error, pending): boolean => {
    return !from.trim() || parseFloat(from) === 0 || !!error || !!pending
  }
)
