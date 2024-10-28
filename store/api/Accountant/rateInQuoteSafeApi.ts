import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  readContract,
  type ReadContractReturnType,
  type ReadContractErrorType,
  type ReadContractParameters,
} from 'wagmi/actions'
import { Address } from 'viem'
import { AccountantWithRateProvidersAbi } from '@/contracts/AccountantWithRateProvidersAbi'

import { wagmiConfig } from '@/config/wagmi'
import { serialize } from 'wagmi'
import { bigIntToNumberAsString } from '@/utils/bigint'

type GetRateInQuoteSafeQueryArgs = {
  quote: Address
  contractAddress: Address
  chainId: number
}

export const rateInQuoteSafeApi = createApi({
  reducerPath: 'rateInQuoteSafeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['RateInQuoteSafe'],
  endpoints: (builder) => ({
    getRateInQuoteSafe: builder.query({
      queryFn: async ({ quote, contractAddress, chainId }) => {
        try {
          const data = await readContract(wagmiConfig, {
            abi: AccountantWithRateProvidersAbi,
            address: contractAddress,
            functionName: 'getRateInQuoteSafe',
            args: [quote],
            chainId,
          })
          return {
            data: {
              rateInQuoteSafeAsString: bigIntToNumberAsString(data),
              truncatedRateInQuoteSafeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 4 }),
              tokenRateInQuote: data,
            },
          }
        } catch (error) {
          return { error: { message: serialize(error) } }
        }
      },
    }),
  }),
})

export const { useGetRateInQuoteSafeQuery } = rateInQuoteSafeApi
