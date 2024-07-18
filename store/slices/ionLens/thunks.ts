import { liquidity } from '@/api/contracts/IonLens/liquidity'
import { RootState } from '@/store'
import { MarketKey } from '@/types/Market'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { selectChainConfig } from '../bridges'
import { setErrorMessage } from '../status'

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

  const chainConfig = selectChainConfig(state)

  try {
    const liquidityPromises = Object.values(MarketKey).map(async (marketKey) => {
      const ionPool = chainConfig?.markets[marketKey]?.contracts.ionPool
      if (!ionPool) {
        return { marketKey, liquidity: '0' }
      }
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
    dispatch(setErrorMessage(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
