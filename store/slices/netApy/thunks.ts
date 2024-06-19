import { RootState } from '@/store'
import { NetApyItem } from '@/types/NetApyItem'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { setError } from '../status'
import { selectAddress } from '../account'
import { selectNetApyEndTime, selectNetApyStartTime } from './selectors'
import { getNetApy } from '@/api/backend/netApy'

export interface FetchNetApyHistoryResult {
  netApyHistory: NetApyItem[]
}

/**
 * Fetches the net APY history.
 *
 * @returns A promise that resolves to the fetched net APY history.
 * @throws If the address is not found or the fetch fails.
 */
export const fetchNetApyHistory = createAsyncThunk<
  FetchNetApyHistoryResult,
  void,
  { rejectValue: string; state: RootState }
>('price/fetchNetApyHistory', async (_, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState()
    const address = selectAddress(state)

    if (!address) {
      throw new Error('Address not found. Your wallet may not be connected.')
    }

    const startTime = selectNetApyStartTime(state)
    const endTime = selectNetApyEndTime(state)

    const netApyHistory = await getNetApy({ address, startTime, endTime })

    return { netApyHistory }
  } catch (e) {
    const error = e as Error
    const errorMessage = 'Failed to fetch net apy history.'
    const fullErrorMessage = `${errorMessage}\n${error.message}`
    console.error(fullErrorMessage)
    dispatch(setError(fullErrorMessage))
    return rejectWithValue(errorMessage)
  }
})
