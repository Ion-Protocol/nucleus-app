import { nucleusBackendBaseUrl } from '@/config/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address } from 'viem'

interface RewardsAPYParams {
  tokenAddress: Address
  blockNumber?: number // Optional
  lookBackDays?: number // API defaults to 7 days if not provided
}

interface RewardsAPYResponse {
  apy: number
}
type WithdrawalStatus = 'all' | 'pending' | 'completed' | 'cancelled'
export type WithdrawalParams = {
  user: Address
  vaultAddress: Address
  chainId: number
  status?: WithdrawalStatus
  all?: boolean
  page?: number
  limit?: number
}

export interface Withdrawal {
  id: number
  user: string
  offer_token: string
  want_token: string
  amount: string
  deadline: string
  atomic_price: string
  created_timestamp: string
  ending_timestamp: string
  created_log_index: number
  created_transaction_index: number
  created_block_number: string
  ending_log_index: number
  ending_transaction_index: number
  ending_block_number: string
  status: WithdrawalStatus
  queue_address: string
  chain_id: number
  offer_amount_spent: string
  want_amount_rec: string
  created_transaction_hash: string
  ending_transaction_hash: string
}

export interface Pagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
export interface WithdrawalsResponse {
  data: Withdrawal[]
  pagination: Pagination
}
// Define a service using a base URL and expected endpoints
export const nucleusBackendApi = createApi({
  reducerPath: 'nucleusBackendApi',
  baseQuery: fetchBaseQuery({
    baseUrl: nucleusBackendBaseUrl,
    mode: 'cors',
  }),
  endpoints: (builder) => ({
    // Keep the original single query endpoint
    getDefaultYieldAPY: builder.query<RewardsAPYResponse, RewardsAPYParams>({
      query: ({ tokenAddress, blockNumber, lookBackDays = 14 }) => {
        const params = new URLSearchParams()
        params.append('token_address', tokenAddress)
        if (blockNumber) params.append('block_number', blockNumber.toString())
        if (lookBackDays) params.append('lookback_days', lookBackDays.toString())
        return `v1/vaults/apy?${params.toString()}`
      },
    }),
    withdrawalsByUser: builder.query<WithdrawalsResponse, WithdrawalParams>({
      query: ({ user, vaultAddress, chainId, status = 'all', all, page, limit }) => {
        const params = new URLSearchParams()
        params.append('user', user)
        params.append('vault_address', vaultAddress)
        params.append('chain_id', chainId.toString())
        if (status) params.append('status', status)
        if (all) params.append('all', all.toString())
        if (page) params.append('page', page.toString())
        if (limit) params.append('limit', limit.toString())
        return `v1/withdrawals?${params.toString()}`
      },
    }),
  }),
})

export const { useGetDefaultYieldAPYQuery, useWithdrawalsByUserQuery } = nucleusBackendApi
