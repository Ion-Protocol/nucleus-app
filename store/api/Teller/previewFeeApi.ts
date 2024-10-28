import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  readContract,
  type ReadContractReturnType,
  type ReadContractErrorType,
  type ReadContractParameters,
} from 'wagmi/actions'

import { wagmiConfig } from '@/config/wagmi'
import { CrossChainTellerBaseAbi } from '@/contracts/CrossChainTellerBaseAbi'

export const previewFeeApi = createApi({
  reducerPath: 'previewFeeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['PreviewFee'],
  endpoints: (builder) => ({
    getPreviewFee: builder.query({
      queryFn: async ({ shareAmount, bridgeData, contractAddress, chainId, args }) => {
        try {
          const data = await readContract(wagmiConfig, {
            abi: CrossChainTellerBaseAbi,
            address: contractAddress,
            functionName: 'previewFee',
            args: [shareAmount, bridgeData],
            chainId: chainId,
            ...args,
          })
          return { data: data as ReadContractReturnType }
        } catch (error) {
          return { error: error as ReadContractErrorType }
        }
      },
    }),
  }),
})

export const { useGetPreviewFeeQuery } = previewFeeApi
