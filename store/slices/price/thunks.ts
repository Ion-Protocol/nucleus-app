import { wagmiConfig } from '@/config/wagmi'
import Chainlink from '@/contracts/Chainlink.json'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { readContract } from '@wagmi/core'
import { Abi } from 'viem'
import { selectChainConfig } from '../bridges'
import { setErrorMessage } from '../status'

export interface FetchPriceResult {
  price: string
}

/**
 * Fetches the price of ETH using the Chainlink oracle.
 *
 * @returns A promise that resolves to the fetched price.
 */
export const fetchEthPrice = createAsyncThunk<FetchPriceResult, void, { rejectValue: string; state: RootState }>(
  'price/fetchEthPrice',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const state = getState()
    const chainConfig = selectChainConfig(state)
    const chainlinkAddress = chainConfig.contracts.chainlink
    try {
      const result = (await readContract(wagmiConfig, {
        abi: Chainlink.abi as Abi,
        address: chainlinkAddress,
        functionName: 'latestRoundData',
        args: [],
      })) as Array<bigint>

      const ethPrice = result[1] as bigint
      return { price: ethPrice.toString() }
    } catch (e) {
      const error = e as Error
      const errorMessage = 'Failed to fetch ETH price.'
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)
