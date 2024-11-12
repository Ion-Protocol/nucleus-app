import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  writeContract,
  readContract,
  type ReadContractReturnType,
  type ReadContractErrorType,
  type ReadContractParameters,
  waitForTransactionReceipt,
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

export interface UpdateAtomicRequestArgs {
  offer: Address
  want: Address
  userRequest: AtomicRequest
}

export interface UpdateAtomicRequestOptions {
  atomicQueueContractAddress: Address
  chainId: number
}

export const atomicQueueApi = createApi({
  reducerPath: 'atomicQueueApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['atomicRequest'],
  endpoints: (builder) => ({
    updateAtomicRequest: builder.mutation<
      `0x${string}`,
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
            args: [offer, want, userRequest as never],
            chainId,
          })
          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: hash,
          })
          return { data: txReceipt.transactionHash }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
      extraOptions: { maxRetries: 0 },
    }),
  }),
})

export const { useUpdateAtomicRequestMutation } = atomicQueueApi
