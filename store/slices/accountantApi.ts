import { wagmiConfig } from '@/config/wagmi'
import { AccountantWithRateProvidersAbi } from '@/contracts/AccountantWithRateProvidersAbi'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address } from 'viem'
import { serialize } from 'wagmi'
import { readContract, ReadContractErrorType } from 'wagmi/actions'

interface GetRateInQuoteSafeQueryArgs {
  quote: Address
  contractAddress: Address
  chainId: number
}

interface GetRateInQuoteSafeQueryResponse {
  rateInQuoteSafeAsString: string
  truncatedRateInQuoteSafeAsString: string
  rateInQuoteSafe: string
}

type WagmiError = ReadContractErrorType

export const accountantApi = createApi({
  reducerPath: 'rateInQuoteSafeApi',
  baseQuery: fakeBaseQuery<string>(),
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
            data: {
              rateInQuoteSafeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 18 }),
              truncatedRateInQuoteSafeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 4 }),
              rateInQuoteSafe: data.toString(),
            },
          }
        } catch (err) {
          const error = serialize(err)
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
    }),
  }),
})

export const { useGetRateInQuoteSafeQuery } = accountantApi
