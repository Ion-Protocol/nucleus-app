import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  writeContract,
  readContract,
  type ReadContractReturnType,
  type ReadContractErrorType,
  type ReadContractParameters,
} from 'wagmi/actions'
import { Address } from 'viem'
import { AtomicQueueAbi } from '@/contracts/AtomicQueueAbi'

import { wagmiConfig } from '@/config/wagmi'
import { serialize } from 'wagmi'

export interface AtomicRequest {
  deadline: bigint
  atomicPrice: bigint
  offerAmount: bigint
  inSolve: boolean
}

export interface UpdateAtomicRequestParams {
  offer: Address
  want: Address
  userRequest: AtomicRequest
}

export interface UpdateAtomicRequestOptions {
  atomicQueueContractAddress: Address
  userAddress: Address
  chainId: number
}

export const atomicQueueApi = createApi({
  reducerPath: 'atomicQueueApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['atomicRequest'],
  endpoints: (builder) => ({
    updateAtomicRequest: builder.mutation({
      queryFn: async ({ atomicQueueContractAddress, offer, want, userRequest, chainId }) => {
        try {
          const response = await writeContract(wagmiConfig, {
            abi: AtomicQueueAbi,
            address: atomicQueueContractAddress,
            functionName: 'updateAtomicRequest',
            args: [offer, want, userRequest],
            chainId,
          })
          return {
            data: {
              response,
            },
          }
        } catch (error) {
          return { error: { message: serialize(error) } }
        }
      },
    }),
  }),
})

export const { useUpdateAtomicRequestMutation } = atomicQueueApi
