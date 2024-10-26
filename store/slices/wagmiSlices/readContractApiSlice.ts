import { wagmiConfig } from '@/config/wagmi'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { readContract, ReadContractErrorType, ReadContractParameters, ReadContractReturnType } from 'wagmi/actions'

export const readContractApi = createApi({
  reducerPath: 'readContractApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ContractData'],
  endpoints: (builder) => ({
    readContract: builder.query<ReadContractReturnType, ReadContractParameters>({
      queryFn: async (args: ReadContractParameters) => {
        try {
          const data = await readContract(wagmiConfig, {
            ...args,
          })
          return { data }
        } catch (error) {
          return { error: error as ReadContractErrorType }
        }
      },
      providesTags: (result, error, args) => [{ type: 'ContractData', id: JSON.stringify(args) }],
    }),
  }),
})

export const { useReadContractQuery } = readContractApi
