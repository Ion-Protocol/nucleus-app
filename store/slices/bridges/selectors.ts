import { BridgeKey, ChainKey, chainsConfig } from '@/config/chains'
import { TokenKey } from '@/config/token'
import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import { selectCurrency } from '@/store/slices/currency'
import { Bridge, BridgeUI } from '@/types/Bridge'
import { utils } from '@/utils'
import { numToPercent } from '@/utils/number'
import { createSelector } from 'reselect'
import { selectChain } from '../chain'
import { selectPrice } from '../price'
import { selectBridgeKey } from '../router'

export const selectBridgesState = (state: RootState) => state.bridges
export const selectInputError = createSelector([selectBridgesState], (bridgesState) => bridgesState.inputError)
export const selectBridgesLoading = createSelector([selectBridgesState], (bridgesState) => bridgesState.overallLoading)
export const selectBridgeSourceChain = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceChain)
export const selectBridgeDestinationChain = createSelector(
  [selectBridgesState],
  (bridgesState) => bridgesState.destinationChain
)

export const selectChainConfig = createSelector([selectChain], (chainKey: ChainKey) => {
  return chainsConfig[chainKey]
})

export const selectMarketsConfig = createSelector([selectChainConfig], (chainConfig) => {
  return chainConfig.markets
})

export const selectBridgeConfig = createSelector(
  [selectChainConfig, selectBridgeKey],
  (chainConfig, bridgeKey): Bridge & { key: BridgeKey } => {
    if (!bridgeKey) {
      throw new Error(
        `Bridge key: ${bridgeKey} not found. It's likely a component using the bridge key is being rendered before it is set.`
      )
    }
    const bridgeConfig = chainConfig.bridges[bridgeKey]
    if (!bridgeConfig) {
      throw new Error(`Bridge config not found for bridge key: ${bridgeKey} on chain: ${chainConfig}`)
    }
    return { ...bridgeConfig, key: bridgeKey }
  }
)

export const selectBridges = createSelector([selectChainConfig], (chainConfig): (Bridge & { key: BridgeKey })[] => {
  return Object.keys(chainConfig.bridges).map((key) => ({
    key: key as BridgeKey,
    ...(chainConfig.bridges[key as BridgeKey] as Bridge),
  }))
})

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
  if (!bridgesState.data) {
    throw new Error('Bridges data is not initialized')
  }
  return bridgesState.data
})

export const selectBridgeData = createSelector([selectBridgesData, selectBridgeKey], (bridgesData, bridgeKey) => {
  return bridgesData[bridgeKey]
})

/**
 * Selects the Total Value Locked (TVL) for a specific bridge key.
 *
 * @param key - The key of the bridge.
 * @returns The TVL for the specified bridge key, or `undefined` if not found.
 */
export const selectBridgeTVLByKey = createSelector(
  [selectBridgesData, selectBridgeKey],
  (bridgesData, bridgeKey): bigint => {
    return BigInt(bridgesData[bridgeKey].tvl.value)
  }
)

/**
 * Selects the APY (Annual Percentage Yield) value for a given bridge key.
 * @param key - The key of the bridge.
 * @returns The APY value as a string, or undefined if the bridge key is not found.
 */
export const selectBridgeAPYByKey = createSelector(
  [selectBridgesData, selectBridgeKey],
  (bridgesData, bridgeKey): number => {
    return bridgesData[bridgeKey].apy.value as number
  }
)

/**
 * Selects the loading state of a specific bridge identified by the given key.
 * @param key - The key of the bridge.
 * @returns The loading state of the bridge.
 */
export const selectBridgeLoadingByKey = createSelector(
  [selectBridgesData, selectBridgeKey],
  (bridgesData, bridgeKey) => {
    return bridgesData[bridgeKey].tvl.loading || bridgesData[bridgeKey].apy.loading
  }
)

/**
 * Selects the formatted total value locked (TVL) for a specific bridge key.
 *
 * @param key - The bridge key.
 * @returns A selector function that returns the formatted TVL.
 */
export const selectFormattedBridgeTVLByKey = createSelector(
  [selectBridgeTVLByKey, selectPrice, selectCurrency],
  (tvl, price, currency) => {
    const formattedTvl = utils.currencySwitch(currency, tvl, price)
    return formattedTvl
  }
)

/**
 * Selects the formatted Annual Percentage Yield (APY) for a given bridge key.
 *
 * @param key - The bridge key.
 * @returns The formatted APY as a string.
 */
export const selectFormattedBridgeAPYByKey = createSelector([selectBridgeAPYByKey], (apy) => {
  return numToPercent((apy || 0) * 100)
})

/**
 * Selects a bridge by its key and formats the data.
 *
 * @param key - The key of the bridge.
 * @returns The formatted bridge data for the specified key.
 */
export const selectFormattedBridgeData = createSelector(
  [
    selectBridgeConfig,
    selectBridgeTVLByKey,
    selectBridgeAPYByKey,
    selectFormattedBridgeTVLByKey,
    selectFormattedBridgeAPYByKey,
  ],
  (bridgeConfig, rawTvl, rawApy, formattedTvl, formattedApy) => {
    // Trim the description down to a certain length to fit inside the container properly
    const descriptionLength = uiConfig.pages.dashboard.yieldBridges.descriptionLength
    const description = bridgeConfig.description || ''
    const trimmedDescription =
      description.length > descriptionLength ? `${description.slice(0, descriptionLength)}...` : description

    return {
      ...bridgeConfig,
      key: bridgeConfig.key as BridgeKey,
      tvl: {
        raw: rawTvl,
        formatted: formattedTvl,
      },
      apy: {
        raw: rawApy,
        formatted: formattedApy,
      },
      name: bridgeConfig.name || '',
      description: trimmedDescription,
    } as BridgeUI
  }
)

/**
 * Selects all bridges from the state and formats the data.
 * @param state - The root state of the application.
 * @returns An array of bridges with formatted data.
 */
export const selectAllBridges = createSelector(
  [(state: RootState) => state, selectBridgesData],
  (state, bridgesData) => {
    return Object.keys(bridgesData).map((key) => selectFormattedBridgeData(state))
  }
)

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
export const selectFromTokenKeyForBridge = createSelector([selectBridgeData], (bridgeData): TokenKey => {
  if (!bridgeData.selectedFromToken) {
    throw new Error("Bridge's selectedFromToken is not initialized")
  }
  return bridgeData.selectedFromToken
})

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
