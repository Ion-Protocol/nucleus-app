import { erc20Abi } from 'viem'
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
  tagTypes: ['allowErc20', 'approveErc20'],
  endpoints: (builder) => ({
    allowERC20: builder.query({
      queryFn: async ({ tokenAddress, spenderAddress, userAddress }) => {
        try {
          const results = await readContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'allowance',
            args: [userAddress, spenderAddress],
          })
          return { data: results }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
      providesTags: ['allowErc20'],
    }),
    balanceOf: builder.query({
      queryFn: async ({ tokenAddress, userAddress }) => {
        try {
          const results = await readContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'balanceOf',
            args: [userAddress],
          })
          return { data: results }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
    }),
    approveERC20: builder.mutation({
      queryFn: async ({ tokenAddress, spenderAddress, amount }) => {
        try {
          const writeContractResult = await writeContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'approve',
            args: [spenderAddress, amount],
          })
          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: writeContractResult,
          })
          return { data: txReceipt }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
    }),
  }),
})

export const { useAllowERC20Query, useBalanceOfQuery, useApproveERC20Mutation } = erc20Api
