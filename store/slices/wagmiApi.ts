import { wagmiConfig } from '@/config/wagmi'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Hash } from 'viem'
import {
  type ReadContractErrorType,
  type ReadContractParameters,
  type ReadContractReturnType,
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType,
  type WriteContractErrorType,
  type WriteContractParameters,
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from 'wagmi/actions'

/**
 * Union type for all possible Wagmi errors
 */
type WagmiError = ReadContractErrorType | WriteContractErrorType | WaitForTransactionReceiptErrorType

/**
 * API for interacting with smart contracts using wagmi
 * Provides type-safe wrappers around common contract interactions
 */
export const wagmiApi = createApi({
  reducerPath: 'wagmiApi',
  baseQuery: fakeBaseQuery<WagmiError>(),
  tagTypes: ['ReadContract', 'WriteContract', 'WaitForTransactionReceipt'],
  endpoints: (builder) => ({
    /**
     * Read data from a smart contract
     * @param params Contract read parameters including abi, address, function name and args
     */
    readContract: builder.query<ReadContractReturnType, ReadContractParameters>({
      queryFn: async (params) => {
        try {
          const results = await readContract(wagmiConfig, params)
          return { data: results }
        } catch (err) {
          const error = err as ReadContractErrorType
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      providesTags: ['ReadContract'],
    }),

    /**
     * Write data to a smart contract
     * @param params Contract write parameters including abi, address, function name and args
     * @returns Transaction hash
     */
    writeContract: builder.mutation<Hash, WriteContractParameters>({
      queryFn: async (params) => {
        try {
          const hash = await writeContract(wagmiConfig, params)
          return { data: hash }
        } catch (err) {
          const error = err as WriteContractErrorType
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      invalidatesTags: ['WriteContract'],
    }),

    /**
     * Wait for a transaction to be mined and get the receipt
     * @param params Transaction parameters including hash
     * @returns Transaction receipt
     */
    waitForTransaction: builder.query<WaitForTransactionReceiptReturnType, WaitForTransactionReceiptParameters>({
      queryFn: async (params) => {
        try {
          const receipt = await waitForTransactionReceipt(wagmiConfig, params)
          return { data: receipt }
        } catch (err) {
          const error = err as WaitForTransactionReceiptErrorType
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
      providesTags: ['WaitForTransactionReceipt'],
    }),
  }),
})

export const { useReadContractQuery, useWriteContractMutation, useWaitForTransactionQuery } = wagmiApi
