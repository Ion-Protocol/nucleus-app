'use-client'

import { wagmiConfig } from '@/config/wagmi'
import { AtomicQueueAbi } from '@/contracts/AtomicQueueAbi'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address, Hash, WaitForTransactionReceiptErrorType } from 'viem'
import { serialize } from 'wagmi'
import { writeContract, type WriteContractErrorType } from 'wagmi/actions'

export interface AtomicRequest {
  deadline: bigint
  atomicPrice: bigint
  offerAmount: bigint
  inSolve: boolean
}

export interface UpdateAtomicRequestArgs {
  offer: Address
  want: Address
  userRequest: AtomicRequest
}

export interface UpdateAtomicRequestOptions {
  atomicQueueContractAddress: Address
  chainId: number
}

type WagmiError = WriteContractErrorType | WaitForTransactionReceiptErrorType

export const atomicQueueApi = createApi({
  reducerPath: 'atomicQueueApi',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['atomicRequest'],
  endpoints: (builder) => ({
    updateAtomicRequest: builder.mutation<
      Hash,
      { atomicRequestArg: UpdateAtomicRequestArgs; atomicRequestOptions: UpdateAtomicRequestOptions }
    >({
      queryFn: async ({ atomicRequestArg, atomicRequestOptions }, api, extraOptions, baseQuery) => {
        const { offer, want, userRequest } = atomicRequestArg
        const { atomicQueueContractAddress, chainId } = atomicRequestOptions
        try {
          const hash = await writeContract(wagmiConfig, {
            abi: AtomicQueueAbi,
            address: atomicQueueContractAddress,
            functionName: 'updateAtomicRequest',
            args: [
              offer,
              want,
              {
                deadline: userRequest.deadline,
                atomicPrice: userRequest.atomicPrice,
                offerAmount: userRequest.offerAmount,
                inSolve: userRequest.inSolve,
              },
            ],
            chainId,
          })
          return { data: hash }
        } catch (err) {
          const error = serialize(err)
          return {
            error: error,
          }
        }
      },
    }),
  }),
})

export const {
  endpoints: { updateAtomicRequest },
  useUpdateAtomicRequestMutation,
} = atomicQueueApi
