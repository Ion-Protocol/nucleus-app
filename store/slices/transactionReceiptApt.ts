import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  type WaitForTransactionReceiptParameters,
  type WaitForTransactionReceiptReturnType,
  waitForTransactionReceipt,
} from 'wagmi/actions'

import { wagmiConfig } from '@/config/wagmi'
import { serialize } from 'wagmi'

export const transactionReceiptApi = createApi({
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

export const { useWaitForTransactionReceiptQuery, useLazyWaitForTransactionReceiptQuery } = transactionReceiptApi
