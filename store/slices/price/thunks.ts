import { contractAddresses } from '@/config/contracts'
import { wagmiConfig } from '@/config/wagmi'
import Chainlink from '@/contracts/Chainlink.json'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { readContract } from '@wagmi/core'
import { Abi } from 'viem'
import { setErrorMessage } from '../status'

export interface FetchPriceResult {
  price: string
}

/**
 * Fetches the price of ETH using the Chainlink oracle.
 * Always fetches the price on the mainnet even when not connected to mainnet.
 *
 * @returns A promise that resolves to the fetched price.
 */
export const fetchEthPrice = createAsyncThunk<FetchPriceResult, void, { rejectValue: string; state: RootState }>(
  'price/fetchEthPrice',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const chainlinkAddress = contractAddresses.chainlink

    try {
      const result = (await readContract(wagmiConfig, {
        abi: Chainlink.abi as Abi,
        address: chainlinkAddress,
        functionName: 'latestRoundData',
        args: [],
        chainId: 1,
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
