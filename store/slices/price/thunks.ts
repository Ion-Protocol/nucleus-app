import { contractAddresses } from '@/config/contracts'
import { wagmiConfig } from '@/config/wagmi'
import Chainlink from '@/contracts/Chainlink.json'
import { RootState } from '@/store'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Abi } from 'viem'
import { readContract } from 'wagmi/actions'
import { setErrorMessage } from '../status'

export interface FetchRateResult {
  rate: string
}

/**
 * Fetches the price of ETH using the Chainlink oracle.
 * Always fetches the price on the mainnet even when not connected to mainnet.
 *
 * @returns A promise that resolves to the fetched price.
 */
export const fetchUsdPerEthRate = createAsyncThunk<FetchRateResult, void, { rejectValue: string; state: RootState }>(
  'price/fetchUsdPerEthRate',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const chainlinkAddress = contractAddresses.chainlinkUsdPerEth

    try {
      const result = (await readContract(wagmiConfig, {
        abi: Chainlink.abi as Abi,
        address: chainlinkAddress,
        functionName: 'latestRoundData',
        args: [],
        chainId: 1,
      })) as Array<bigint>

      const ethPrice = result[1] as bigint
      return { rate: ethPrice.toString() }
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

/**
 * Fetches the BTC price using the Chainlink oracle.
 * Always fetches the price on the mainnet even when not connected to mainnet.
 *
 * @returns A promise that resolves to the fetched price.
 */
export const fetchUsdPerBtcRate = createAsyncThunk<FetchRateResult, void, { rejectValue: string; state: RootState }>(
  'price/fetchUsdPerBtcRate',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const chainlinkAddress = contractAddresses.chainlinkUsdPerBtc

    try {
      const result = (await readContract(wagmiConfig, {
        abi: Chainlink.abi as Abi,
        address: chainlinkAddress,
        functionName: 'latestRoundData',
        args: [],
        chainId: 1,
      })) as Array<bigint>

      const btcPrice = result[1] as bigint
      return { rate: btcPrice.toString() }
    } catch (e) {
      const error = e as Error
      const errorMessage = 'Failed to fetch BTC price.'
      const fullErrorMessage = `${errorMessage}\n${error.message}`
      console.error(fullErrorMessage)
      dispatch(setErrorMessage(fullErrorMessage))
      return rejectWithValue(errorMessage)
    }
  }
)
