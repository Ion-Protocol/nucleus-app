import { Address, erc20Abi } from 'viem'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  writeContract,
  type WriteContractParameters,
  type WriteContractErrorType,
  type WriteContractReturnType,
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptReturnType,
  waitForTransactionReceipt,
  readContract,
} from 'wagmi/actions'

import { wagmiConfig } from '@/config/wagmi'
import { serialize } from 'wagmi'

export const erc20Api = createApi({
  reducerPath: 'erc20Api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['allowance', 'approve'],
  endpoints: (builder) => ({
    allowance: builder.query({
      queryFn: async ({
        tokenAddress,
        spenderAddress,
        userAddress,
        chainId,
      }: {
        tokenAddress: Address
        spenderAddress: Address
        userAddress: Address
        chainId: number
      }) => {
        try {
          const results = await readContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'allowance',
            args: [userAddress, spenderAddress],
            chainId,
          })
          return { data: results }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
      providesTags: ['allowance'],
    }),
    balanceOf: builder.query({
      queryFn: async ({ tokenAddress, userAddress, chainId }) => {
        try {
          const results = await readContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'balanceOf',
            args: [userAddress],
            chainId,
          })
          return { data: results }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
    }),
    approve: builder.mutation({
      queryFn: async ({ tokenAddress, spenderAddress, amount, chainId }) => {
        try {
          const writeContractResult = await writeContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'approve',
            args: [spenderAddress, amount],
            chainId,
          })

          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: writeContractResult,
          })
          return { data: txReceipt.transactionHash }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
      invalidatesTags: ['allowance'],
    }),
  }),
})

export const { useAllowanceQuery, useBalanceOfQuery, useApproveMutation } = erc20Api
