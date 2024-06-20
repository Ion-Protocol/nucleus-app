import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { MarketKey } from '@/types/Market'
import { selectChain } from '../chain'
import { setError } from '../status'
import { liquidity } from '@/api/contracts/IonLens/liquidity'
import { chainsConfig } from '@/config/chains'

export type FetchIonLensResult = Record<MarketKey, string>

/**
 * Fetches the liquidity for all markets.
 *
 * @returns A promise that resolves to an object containing the liquidity for each market.
 * @throws If there is an error while fetching the liquidity for all markets.
 */
export const fetchLiquidityForAllMarkets = createAsyncThunk<
  FetchIonLensResult,
  void,
  { rejectValue: string; state: RootState }
>('price/fetchLiquidityForAllMarkets', async (_, { getState, rejectWithValue, dispatch }) => {
  const state = getState()

  const chainKey = selectChain(state)

  try {
    const liquidityPromises = Object.values(MarketKey).map(async (marketKey) => {
      const ionPool = chainsConfig[chainKey].markets[marketKey].contracts.ionPool
      const liquidityValue = await liquidity({ ionPool })
      return { marketKey, liquidity: liquidityValue.toString() }
    })

    const liquidities = await Promise.all(liquidityPromises)

    const result: FetchIonLensResult = liquidities.reduce((acc, { marketKey, liquidity }) => {
      acc[marketKey as MarketKey] = liquidity
      return acc
    }, {} as FetchIonLensResult)

    return result
  } catch (e) {
    const error = e as Error
    const errorMessage = 'Failed to fetch liquidity for all markets.'
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
