import { wagmiConfig } from '@/config/wagmi'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address, erc20Abi, Hash } from 'viem'
import { serialize } from 'wagmi'
import {
  readContract,
  type ReadContractErrorType,
  type WaitForTransactionReceiptErrorType,
  writeContract,
  type WriteContractErrorType,
} from 'wagmi/actions'

type WagmiError = WriteContractErrorType | WaitForTransactionReceiptErrorType | ReadContractErrorType

interface AllowanceArgs {
  tokenAddress: Address
  spenderAddress: Address
  userAddress: Address
  chainId: number
}

interface ApproveArgs {
  tokenAddress: Address
  spenderAddress: Address
  amount: bigint
  chainId: number
}

interface BalanceOfArgs {
  tokenAddress: Address
  userAddress: Address
  chainId: number
}

export const erc20Api = createApi({
  reducerPath: 'erc20Api',
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['allowance', 'approve', 'balance'],
  endpoints: (builder) => ({
    allowance: builder.query<bigint, AllowanceArgs>({
      queryFn: async ({ tokenAddress, spenderAddress, userAddress, chainId }) => {
        try {
          const results = await readContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'allowance',
            args: [userAddress, spenderAddress],
            chainId,
          })
          return { data: results }
        } catch (err) {
          const error = serialize(err)
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      providesTags: ['allowance'],
    }),
    balanceOf: builder.query<bigint, BalanceOfArgs>({
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
        } catch (err) {
          const error = serialize(err)
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      providesTags: ['balance'],
    }),
    approve: builder.mutation<Hash, ApproveArgs>({
      queryFn: async ({ tokenAddress, spenderAddress, amount, chainId }) => {
        try {
          const hash = await writeContract(wagmiConfig, {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: 'approve',
            args: [spenderAddress, amount],
            chainId,
          })
          return { data: hash }
        } catch (err) {
          const error = serialize(err)
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      invalidatesTags: ['allowance'],
    }),
  }),
})

export const { useAllowanceQuery, useBalanceOfQuery, useApproveMutation } = erc20Api
