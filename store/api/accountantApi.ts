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

type GetRateInQuoteSafeQueryResponse = {
  rateInQuoteSafeAsString: string
  truncatedRateInQuoteSafeAsString: string
  rateInQuoteSafe: bigint
}

export const accountantApi = createApi({
  reducerPath: 'rateInQuoteSafeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['RateInQuoteSafe'],
  endpoints: (builder) => ({
    getRateInQuoteSafe: builder.query<GetRateInQuoteSafeQueryResponse, GetRateInQuoteSafeQueryArgs>({
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
            /**
             * TODO: This should be handled with transformResponse
             * * The fee needed to process the withdrawal is hardcoded
             * * We should return the following, maybe in two objects
             * rateInQuoteSafe: BigInt
             * rateInQuoteSafeAsString: String
             * rateInQuoteSafeAsTruncatedString: String
             * rateInQuoteSafeWithFee: BigInt
             */
            data: {
              rateInQuoteSafeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 18 }),
              truncatedRateInQuoteSafeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 4 }),
              rateInQuoteSafe: data,
            },
          }
        } catch (error) {
          return { error: { message: serialize(error) } }
        }
      },
    }),
  }),
})

export const { useGetRateInQuoteSafeQuery } = accountantApi
