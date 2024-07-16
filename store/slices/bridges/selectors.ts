import { BridgeKey, ChainKey, chainsConfig } from '@/config/chains'
import { TokenKey } from '@/config/token'
import { RootState } from '@/store'
import { selectCurrency } from '@/store/slices/currency'
import { Bridge } from '@/types/Bridge'
import { utils } from '@/utils'
import { numToPercent } from '@/utils/number'
import { createSelector } from 'reselect'
import { selectChain } from '../chain'
import { selectPrice } from '../price'
import { selectBridgeKey } from '../router'
import { BridgeData } from './initialState'

export const selectBridgesState = (state: RootState) => state.bridges
export const selectInputError = createSelector([selectBridgesState], (bridgesState) => bridgesState.inputError)
export const selectBridgesLoading = createSelector(
  [selectBridgesState],
  (bridgesState): boolean => bridgesState.overallLoading
)
export const selectBridgeSourceChain = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceChain)
export const selectBridgeDestinationChain = createSelector(
  [selectBridgesState],
  (bridgesState) => bridgesState.destinationChain
)

export const selectTvlLoading = (state: RootState) => state.bridges.tvlLoading

export const selectChainConfig = createSelector([selectChain], (chainKey) => {
  return chainsConfig[chainKey]
})

export const selectMarketsConfig = createSelector([selectChainConfig], (chainConfig) => {
  return chainConfig.markets
})

export const selectBridgeConfig = createSelector(
  [selectChainConfig, selectBridgeKey],
  (chainConfig, bridgeKey): Bridge & { key: BridgeKey } => {
    const bridgeConfig = chainConfig.bridges[bridgeKey] as Bridge
    return { ...bridgeConfig, key: bridgeKey }
  }
)

export const selectBridgeConfigByKey = (bridgeKey: BridgeKey) => {
  return createSelector([selectChainConfig], (chainConfig) => {
    const bridgeConfig = chainConfig.bridges[bridgeKey]
    return { ...bridgeConfig, key: bridgeKey }
  })
}

export const selectBridgesAsArray = createSelector(
  [selectChainConfig],
  (chainConfig): (Bridge & { key: BridgeKey })[] => {
    return Object.keys(chainConfig.bridges).map((key) => ({
      key: key as BridgeKey,
      ...(chainConfig.bridges[key as BridgeKey] as Bridge),
    }))
  }
)

export const selectChainsNamesAndKeys = createSelector([(state: RootState) => state], () => {
  return Object.keys(chainsConfig).map((key) => {
    return {
      key,
      name: chainsConfig[key as ChainKey].name,
    }
  })
})

export const selectBridgeKeys = createSelector([selectChainConfig], (chainConfig): BridgeKey[] => {
  return Object.keys(chainConfig.bridges) as BridgeKey[]
})

export const selectBridgesData = createSelector([selectBridgesState], (bridgesState) => {
  return bridgesState.data
})

export const selectBridgeData = createSelector(
  [selectBridgesData, selectBridgeKey],
  (bridgesData, bridgeKey): BridgeData => {
    return bridgesData?.[bridgeKey] as BridgeData
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
    return BigInt(bridgesData[bridgeKey].tvl.value)
  })

export const selectActiveBridgeTvl = createSelector([selectBridgesData, selectBridgeKey], (bridgesData, bridgeKey) => {
  return BigInt(bridgesData[bridgeKey].tvl.value)
})

/**
 * Selects the APY (Annual Percentage Yield) value for a given bridge key.
 * @param key - The key of the bridge.
 * @returns The APY value as a string, or undefined if the bridge key is not found.
 */
export const selectBridgeApyKey = (bridgeKey: BridgeKey) =>
  createSelector([selectBridgesData], (bridgesData): number | null => {
    if (!bridgesData) return null
    return bridgesData[bridgeKey].apy.value as number
  })

/**
 * Selects the loading state of a specific bridge identified by the given key.
 * @param key - The key of the bridge.
 * @returns The loading state of the bridge.
 */
export const selectBridgeLoadingByKey = createSelector(
  [selectBridgesData, selectBridgeKey],
  (bridgesData, bridgeKey): boolean => {
    if (!bridgesData) return false
    return bridgesData[bridgeKey].tvl.loading || bridgesData[bridgeKey].apy.loading
  }
)

/**
 * Selects the formatted total value locked (TVL) for a specific bridge key.
 *
 * @param key - The bridge key.
 * @returns A selector function that returns the formatted TVL.
 */
export const selectFormattedBridgeTvlByKey = (bridgeKey: BridgeKey) =>
  createSelector([selectBridgeTvlByKey(bridgeKey), selectPrice, selectCurrency], (tvl, price, currency) => {
    const formattedTvl = utils.currencySwitch(currency, tvl, price)
    return formattedTvl || '-'
  })

export const selectActiveFormattedBridgeTvl = createSelector(
  [selectActiveBridgeTvl, selectPrice, selectCurrency],
  (tvl, price, currency) => {
    const formattedTvl = utils.currencySwitch(currency, tvl, price)
    return formattedTvl || '-'
  }
)

/**
 * Selects the formatted Annual Percentage Yield (APY) for a given bridge key.
 *
 * @param key - The bridge key.
 * @returns The formatted APY as a string.
 */
export const selectFromattedBridgeApyKey = (bridgeKey: BridgeKey) =>
  createSelector([selectBridgeApyKey(bridgeKey)], (apy) => {
    return numToPercent((apy || 0) * 100) || '-'
  })

export const selectAllBridgeKeys = createSelector([selectChainConfig], (chainConfig): BridgeKey[] => {
  return Object.keys(chainConfig.bridges) as BridgeKey[]
})

/**
 * Selects the 'from' value of a bridge identified by the given key.
 *
 * @param state - The root state.
 * @param key - The key of the bridge.
 * @returns The 'from' value of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeFrom = createSelector([selectBridgeData], (bridgeData) => {
  return bridgeData.from
})

/**
 * Retrieves the token of a specific bridge from the state.
 * @param state - The root state of the application.
 * @param bridgeKey - The key of the bridge.
 * @returns The token of the bridge, or undefined if the bridge does not exist.
 */
export const selectToTokenKeyForBridge = createSelector([selectBridgeData], (bridgeData) => {
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
  [selectBridgeData, selectBridgeConfig],
  (bridgeData, bridgeConfig): TokenKey => {
    return bridgeData.selectedFromToken || bridgeConfig.sourceTokens[0]
  }
)

/**
 * Retrieves the rate of a specific bridge from the state.
 *
 * @param state - The root state of the application.
 * @param key - The key of the bridge.
 * @returns The rate of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeRate = createSelector([selectBridgeData], (bridgeData) => {
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

export const selectIonPoolContractAddress = createSelector([], () => {
  //
})
