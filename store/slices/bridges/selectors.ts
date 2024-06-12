import { bridgesConfig } from '@/config/bridges'
import { RootState } from '@/store'
import { BridgeKey } from '@/types/Bridge'
import { utils } from '@/utils'
import { createSelector } from 'reselect'
import { selectCurrency } from '@/store/slices/currency'
import { BridgesState } from './slice'
import { selectPrice } from '../price'
import { bigIntToPercent } from '@/utils/bigint'

const selectBridgesState = (state: RootState): BridgesState => state.bridges

/**
 * Selects the Total Value Locked (TVL) for a specific bridge key.
 *
 * @param key - The key of the bridge.
 * @returns The TVL for the specified bridge key, or `undefined` if not found.
 */
export const selectBridgeTVLByKey = (key: BridgeKey) =>
  createSelector([selectBridgesState], (bridgesState): bigint | undefined => {
    return BigInt(bridgesState[key]?.tvl || 0)
  })

/**
 * Selects the APY (Annual Percentage Yield) value for a given bridge key.
 * @param key - The key of the bridge.
 * @returns The APY value as a string, or undefined if the bridge key is not found.
 */
export const selectBridgeAPYByKey = (key: BridgeKey) =>
  createSelector([selectBridgesState], (bridgesState): string | undefined => {
    return bridgesState[key]?.apy
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
    return utils.currencySwitch(currency, tvl, price)
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
 * Selects all bridges from the state and formats the data.
 * @param state - The root state of the application.
 * @returns An array of bridges with formatted data.
 */
export const selectAllBridges = createSelector([(state: RootState) => state], (state) => {
  const bridges = selectBridgesState(state)
  return Object.entries(bridges).map(([key, bridgeData]) => {
    const formattedTvl = selectFormattedBridgeTVLByKey(key as BridgeKey)(state)
    const formattedApy = selectFormattedBridgeAPYByKey(key as BridgeKey)(state)
    return {
      key: key as BridgeKey,
      tvl: {
        raw: BigInt(bridgeData.tvl),
        formatted: formattedTvl,
      },
      apy: {
        raw: BigInt(bridgeData.apy),
        formatted: formattedApy,
      },
      name: bridgesConfig[key as BridgeKey]?.name || '',
    }
  })
})
