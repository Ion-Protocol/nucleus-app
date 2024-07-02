import { totalSupply } from '@/api/contracts/IonPool/totalSupply'
import { RootState } from '@/store'
import { MarketKey } from '@/types/Market'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectChain } from '../chain'
import { setErrorMessage } from '../status'
import { getCurrentBorrowRate } from '@/api/contracts/IonPool/getCurrentBorrowRate'

export type FetchIonPoolResult = Record<MarketKey, string>

/**
 * Fetches the total supply for all markets.
 *
 * @returns A promise that resolves to an object containing the total supply for each market.
 * @throws If there is an error while fetching the total supply for all markets.
 */
export const fetchTotalSupplyForAllMarkets = createAsyncThunk<
  FetchIonPoolResult,
  void,
  { rejectValue: string; state: RootState }
>('price/fetchTotalSupply', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const chainKey = selectChain(state)

  try {
    const totalSupplyPromises = Object.values(MarketKey).map(async (marketKey) => {
      const supply = await totalSupply({ chainKey, marketKey })
      return { marketKey, supply: supply.toString() }
    })

    const totalSupplies = await Promise.all(totalSupplyPromises)

    const result: FetchIonPoolResult = totalSupplies.reduce((acc, { marketKey, supply }) => {
      acc[marketKey as MarketKey] = supply
      return acc
    }, {} as FetchIonPoolResult)

    return result
  } catch (e) {
    const error = e as Error
    const errorMessage = 'Failed to fetch total supply for all markets.'
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})

/**
 * Fetches the current borrow rate for all markets.
 *
 * @returns A promise that resolves to an object containing the current borrow rate for each market.
 * @throws If the fetch operation fails.
 */
export const fetchCurrentBorrowRateForAllMarkets = createAsyncThunk<
  FetchIonPoolResult,
  void,
  { rejectValue: string; state: RootState }
>('price/fetchCurrentBorrowRateForAllMarkets', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const chainKey = selectChain(state)
  const ilkIndex = 0

  try {
    const currentBorrowRatePromises = Object.values(MarketKey).map(async (marketKey) => {
      const currentBorrowRate = await getCurrentBorrowRate({ chainKey, marketKey, ilkIndex })
      return { marketKey, currentBorrowRate: currentBorrowRate.toString() }
    })

    const totalCurrentBorrowRates = await Promise.all(currentBorrowRatePromises)

    const result: FetchIonPoolResult = totalCurrentBorrowRates.reduce((acc, { marketKey, currentBorrowRate }) => {
      acc[marketKey as MarketKey] = currentBorrowRate
      return acc
    }, {} as FetchIonPoolResult)

    return result
  } catch (e) {
    const error = e as Error
    const errorMessage = 'Failed to fetch total supply for all markets.'
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
