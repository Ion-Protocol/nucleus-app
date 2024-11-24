'use-client'

import { wagmiConfig } from '@/config/wagmi'
import { AtomicQueueAbi } from '@/contracts/AtomicQueueAbi'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address, Hash, WaitForTransactionReceiptErrorType } from 'viem'
import { waitForTransactionReceipt, writeContract, type WriteContractErrorType } from 'wagmi/actions'

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
  baseQuery: fakeBaseQuery<WagmiError>(),
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
            args: [offer, want, userRequest as never],
            chainId,
          })
          console.log('Atomic queue hash:', hash)
          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: hash,
            timeout: 60_000,
          })
          console.log('Atomic queue receipt:', txReceipt)
          return { data: txReceipt.transactionHash }
        } catch (err) {
          const error = err as WagmiError
          return {
            error: error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      extraOptions: { maxRetries: 0 },
    }),
  }),
})

export const { useUpdateAtomicRequestMutation } = atomicQueueApi
