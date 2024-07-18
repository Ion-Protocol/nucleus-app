import { getCurrentBorrowRate } from '@/api/contracts/IonPool/getCurrentBorrowRate'
import { totalSupply } from '@/api/contracts/IonPool/totalSupply'
import { RootState } from '@/store'
import { MarketKey } from '@/types/Market'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectMarketsConfig } from '../bridges'
import { setErrorMessage } from '../status'

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

  const marketsConfig = selectMarketsConfig(state)

  try {
    const totalSupplyPromises = Object.values(MarketKey).map(async (marketKey) => {
      const contractAddress = marketsConfig?.[marketKey]?.contracts.ionPool
      if (!contractAddress) return { marketKey, supply: '0' }
      const supply = await totalSupply({ contractAddress })
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

  const ilkIndex = 0
  const marketsConfig = selectMarketsConfig(state)
  if (!marketsConfig) {
    return rejectWithValue('Markets config not found.')
  }

  try {
    const currentBorrowRatePromises = Object.keys(marketsConfig).map(async (marketKey) => {
      const contractAddress = marketsConfig[marketKey as MarketKey]?.contracts.ionPool
      if (!contractAddress) return { marketKey, currentBorrowRate: '0' }
      const currentBorrowRate = await getCurrentBorrowRate({ ilkIndex }, { contractAddress })
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
