import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { utils } from '@/utils'
import { numToPercent } from '@/utils/number'
import { createSelector } from '@reduxjs/toolkit'
import { selectChain } from '../chain'
import { selectCurrency } from '../currency'
import { selectApys, selectUtilizationRates } from '../globalSelectors'
import { selectPrice } from '../price'

export const selectPositions = (state: RootState) => state.positions.data
export const selectPositionsLoading = (state: RootState) => state.positions.loading

export const selectPositionsTableData = createSelector(
  [selectPositions, selectChain, selectPrice, selectCurrency, selectUtilizationRates, selectApys],
  (positions, chainKey, price, currency, utilizationRates, apys) => {
    const markets = Object.values(chainsConfig[chainKey].markets)

    const formattedPositions = positions.map((position) => {
      const market = markets.find((m) => m.id === position.marketId)
      if (!market) {
        throw new Error(`Market not found for marketId ${position.marketId}`)
      }

      const lenderAsset = tokensConfig[market.lenderAsset].name
      const collateralAsset = tokensConfig[market.collateralAsset].name
      const apy = apys[market.key]
      const utilizationRate = utilizationRates[market.key]

      const formattedMarket = `${lenderAsset} | ${collateralAsset}`
      const formattedTotalSupplied = utils.currencySwitch(currency, position.totalSupplied, price)
      const formattedApy = numToPercent(apy, { fractionDigits: 1 })
      const formattedUtilizationRate = numToPercent(utilizationRate, { fractionDigits: 1 })

      return {
        ...position,
        formattedMarket,
        formattedTotalSupplied,
        formattedApy,
        formattedUtilizationRate,
      }
    })
    return formattedPositions
  }
)
