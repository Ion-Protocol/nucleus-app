import { RootState } from '@/store'
import { MarketKey } from '@/types/Market'
import { perSecondToAnnualRate } from '@/utils/rates'
import { createSelector } from '@reduxjs/toolkit'

export const selectTotalSupplies = (state: RootState) => state.ionPool.totalSupplies
export const selectBorrowRates = (state: RootState) => state.ionPool.currentBorrowRates
export const selectIonPoolLoading = (state: RootState) => state.ionPool.loading
export const selectIonPoolError = (state: RootState) => state.ionPool.error

/**
 * Selects the borrow rates as bigints from the borrow rates object.
 *
 * @returns An object containing the borrow rates as bigints, with market keys as keys.
 */
export const selectBigIntBorrowRates = createSelector([selectBorrowRates], (borrowRates) => {
  const bigIntBorrowRates: Record<MarketKey, bigint> = {} as Record<MarketKey, bigint>

  Object.keys(borrowRates).forEach((key) => {
    const marketKey = key as MarketKey
    bigIntBorrowRates[marketKey] = BigInt(borrowRates[marketKey])
  })

  return bigIntBorrowRates
})

/**
 * Selects the borrow rates as annual rates.
 *
 * @param selectBorrowRatesAsBigInts - The selector function that returns the borrow rates as big integers.
 * @returns An object containing the borrow rates as annual rates, indexed by market key.
 */
export const selectAnnualBorrowRates = createSelector([selectBigIntBorrowRates], (borrowRates) => {
  const annualBorrowRates: Record<MarketKey, number> = {} as Record<MarketKey, number>

  Object.keys(borrowRates).forEach((key) => {
    const marketKey = key as MarketKey
    annualBorrowRates[marketKey] = perSecondToAnnualRate(borrowRates[marketKey], 27, 4)
  })

  return annualBorrowRates
})
