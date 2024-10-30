import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptReturnType,
  type WaitForTransactionReceiptParameters,
  waitForTransactionReceipt,
} from 'wagmi/actions'

import { wagmiConfig } from '@/config/wagmi'
import { serialize, useWaitForTransactionReceipt } from 'wagmi'

export const TransactionReceiptApi = createApi({
  reducerPath: 'TransactionReceiptApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    waitForTransactionReceipt: builder.query<WaitForTransactionReceiptReturnType, WaitForTransactionReceiptParameters>({
      queryFn: async ({ hash, ...rest }) => {
        try {
          const results = await waitForTransactionReceipt(wagmiConfig, {
            hash,
            ...rest,
          })
          return { data: results }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
    }),
  }),
})

export const { useWaitForTransactionReceiptQuery } = TransactionReceiptApi
