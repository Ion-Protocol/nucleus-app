import { MarketKey } from '@/types/Market'
import { calculateApy, calculateUtilizationRate } from '@/utils/rates'
import { createSelector } from '@reduxjs/toolkit'
import { selectAssetApys } from './assetApys'
import { selectChainConfig } from './bridges'
import { selectChainKey } from './chain'
import { selectLiquidities } from './ionLens'
import { selectAnnualBorrowRates, selectTotalSupplies } from './ionPool'

/**
 * Selects the utilization rates for each market.
 *
 * @param selectTotalSupplies - Selector function that returns the total supplies for each market.
 * @param selectLiquidities - Selector function that returns the liquidities for each market.
 * @returns An object containing the utilization rates for each market.
 */
export const selectUtilizationRates = createSelector(
  [selectTotalSupplies, selectLiquidities],
  (totalSupplies, liquidities) => {
    const utilizationRates: Record<MarketKey, number> = {} as Record<MarketKey, number>

    for (const marketKey in totalSupplies) {
      if (totalSupplies.hasOwnProperty(marketKey) && liquidities.hasOwnProperty(marketKey)) {
        const totalSupply = BigInt(totalSupplies[marketKey as MarketKey])
        const liquidity = BigInt(liquidities[marketKey as MarketKey])

        utilizationRates[marketKey as MarketKey] = calculateUtilizationRate(totalSupply, liquidity)
      }
    }

    return utilizationRates
  }
)

/**
 * Selects the APYs (Annual Percentage Yields) for each market.
 *
 * @param {string} chainKey - The key of the selected chain.
 * @param {Record<MarketKey, number>} borrowRates - The borrow rates for each market.
 * @param {Record<string, number>} assetApys - The APYs for each asset.
 * @param {Record<MarketKey, number>} utilizationRates - The utilization rates for each market.
 * @returns {Record<MarketKey, number>} - The APYs for each market.
 * @throws {Error} - If no APY is found for a lender asset.
 */
export const selectApys = createSelector(
  [selectChainConfig, selectChainKey, selectAnnualBorrowRates, selectAssetApys, selectUtilizationRates],
  (chainConfig, chainKey, borrowRates, assetApys, utilizationRates) => {
    const apys: Record<MarketKey, number> = {} as Record<MarketKey, number>

    Object.keys(borrowRates).forEach((key) => {
      const marketKey = key as MarketKey
      const lenderAsset = chainConfig?.markets[marketKey]?.lenderAsset
      const lenderAssetApy = lenderAsset !== undefined ? assetApys[lenderAsset] ?? 0 : 0
      apys[marketKey] = calculateApy(borrowRates[marketKey], lenderAssetApy, utilizationRates[marketKey])
    })

    return apys
  }
)
