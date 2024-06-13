import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import { selectCurrency } from '@/store/slices/currency'
import { BridgeUI } from '@/types/Bridge'
import { utils } from '@/utils'
import { bigIntToPercent } from '@/utils/bigint'
import { createSelector } from 'reselect'
import { selectPrice } from '../price'
import { BridgesState } from './initialState'
import { TokenKey } from '@/config/token'

export const selectBridgesState = (state: RootState): BridgesState => state.bridges
export const selectBridgesLoading = createSelector([selectBridgesState], (bridgesState) => bridgesState.overallLoading)
export const selectBridgeSourceChain = createSelector([selectBridgesState], (bridgesState) => bridgesState.sourceChain)
export const selectBridgeDestinationChain = createSelector(
  [selectBridgesState],
  (bridgesState) => bridgesState.destinationChain
)

/**
 * Selects the Total Value Locked (TVL) for a specific bridge key.
 *
 * @param key - The key of the bridge.
 * @returns The TVL for the specified bridge key, or `undefined` if not found.
 */
export const selectBridgeTVLByKey = (key: BridgeKey) =>
  createSelector([selectBridgesState], (bridgesState): bigint | undefined => {
    return BigInt(bridgesState.data[key].tvl.value)
  })

/**
 * Selects the APY (Annual Percentage Yield) value for a given bridge key.
 * @param key - The key of the bridge.
 * @returns The APY value as a string, or undefined if the bridge key is not found.
 */
export const selectBridgeAPYByKey = (key: BridgeKey) =>
  createSelector([selectBridgesState], (bridgesState): bigint | undefined => {
    return BigInt(bridgesState.data[key].apy.value)
  })

/**
 * Selects the formatted total value locked (TVL) for a specific bridge key.
 *
 * @param key - The bridge key.
 * @returns A selector function that returns the formatted TVL.
 */
export const selectFormattedBridgeTVLByKey = (key: BridgeKey) => {
  return createSelector([(state: RootState) => state], (state) => {
    const tvl = selectBridgeTVLByKey(key)(state) || BigInt(0)
    const price = selectPrice(state)
    const currency = selectCurrency(state)
    const formattedTvl = utils.currencySwitch(currency, tvl, price)
    return formattedTvl
  })
}

/**
 * Selects the formatted Annual Percentage Yield (APY) for a given bridge key.
 *
 * @param key - The bridge key.
 * @returns The formatted APY as a string.
 */
export const selectFormattedBridgeAPYByKey = (key: BridgeKey) => {
  return createSelector([selectBridgeAPYByKey(key)], (apy) => {
    const apyAsBigInt = BigInt(apy || '0')
    return bigIntToPercent(apyAsBigInt)
  })
}

/**
 * Selects a bridge by its key and formats the data.
 *
 * @param key - The key of the bridge.
 * @returns The formatted bridge data for the specified key.
 */
export const selectFormattedBridgeDataByKey = (key: BridgeKey) =>
  createSelector([(state: RootState) => state], (state) => {
    const rawTvl = selectBridgeTVLByKey(key)(state)
    const rawApy = selectBridgeAPYByKey(key)(state)
    const formattedTvl = selectFormattedBridgeTVLByKey(key as BridgeKey)(state)
    const formattedApy = selectFormattedBridgeAPYByKey(key as BridgeKey)(state)

    // Trim the description down to a certain length to fit inside the container properly
    const descriptionLength = uiConfig.pages.dashboard.yieldBridges.descrptionLength
    const description = bridgesConfig[key as BridgeKey]?.description || ''
    const trimmedDescription =
      description.length > descriptionLength ? `${description.slice(0, descriptionLength)}...` : description

    return {
      key: key as BridgeKey,
      tvl: {
        raw: rawTvl,
        formatted: formattedTvl,
      },
      apy: {
        raw: rawApy,
        formatted: formattedApy,
      },
      name: bridgesConfig[key as BridgeKey]?.name || '',
      description: trimmedDescription,
    } as BridgeUI
  })

/**
 * Selects all bridges from the state and formats the data.
 * @param state - The root state of the application.
 * @returns An array of bridges with formatted data.
 */
export const selectAllBridges = createSelector([(state: RootState) => state], (state) => {
  const bridges = selectBridgesState(state)
  return Object.keys(bridges.data).map((key) => selectFormattedBridgeDataByKey(key as BridgeKey)(state))
})

/**
 * Selects the 'from' value of a bridge identified by the given key.
 *
 * @param state - The root state.
 * @param key - The key of the bridge.
 * @returns The 'from' value of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeFrom = (state: RootState, key: BridgeKey): string => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.data[key]?.from || ''
}

/**
 * Retrieves the token of a specific bridge from the state.
 * @param state - The root state of the application.
 * @param key - The key of the bridge.
 * @returns The token of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeTokenKey = (state: RootState, key: BridgeKey): TokenKey | undefined => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.data[key]?.selectedToken
}

/**
 * Retrieves the rate of a specific bridge from the state.
 *
 * @param state - The root state of the application.
 * @param key - The key of the bridge.
 * @returns The rate of the bridge, or undefined if the bridge does not exist.
 */
export const selectBridgeRate = (state: RootState, key: BridgeKey): string | undefined => {
  const bridgesState = selectBridgesState(state)
  return bridgesState.data[key]?.rate.value
}
