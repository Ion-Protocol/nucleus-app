import { tokensConfig } from '@/config/tokens'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface RawUserProofResponse {
  proofs: `0x${string}`[]
  values: [`0x${string}`, `0x${string}`[], string[]]
  root: `0x${string}`
  tokenDecimals: { [key: string]: number }
}

export interface TransformedUserProofResponse {
  proof: `0x${string}`[]
  incentiveClaims: TransformedIncentiveClaims
}

export interface TransformedIncentiveClaims {
  userAddress: `0x${string}`
  tokenAmounts: { tokenKey: TokenKey; chainKey: ChainKey; amount: string; decimals: number }[]
}

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

export const userProofApi = createApi({
  reducerPath: 'userProofApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/prod`,
    prepareHeaders: (headers) => {
      // Add any necessary headers here
      return headers
    },
  }),
  endpoints: (builder) => ({
    getUserProofByWallet: builder.query({
      query: ({ walletAddress, chainId }) => `userProof?walletAddress=${walletAddress}&chainId=${chainId}`,
      keepUnusedDataFor: 300, // 5 minutes (quantified as seconds)
      transformResponse: (response: RawUserProofResponse, meta) => {
        if (meta?.response?.status === 404) {
          // Return an empty RawUserProofResponse if 404 is encountered
          return { proof: [], incentiveClaims: { userAddress: '0x', tokenAmounts: [] } } as TransformedUserProofResponse
        }

        // Transform raw incentive claims to transformed incentive claims
        const transformedClaims = {
          userAddress: response.values[0] as `0x${string}`,
          tokenAmounts: response.values[1].map((tokenAddress, index) => {
            // Find the tokenKey from tokensConfig using the token address across all chains
            const tokenKey = Object.keys(tokensConfig).find((key) =>
              Object.values(tokensConfig[key as TokenKey].addresses).includes(tokenAddress)
            ) as TokenKey

            // Find the chainKey that matches the tokenAddress
            const chainKey = Object.keys(tokensConfig[tokenKey].addresses).find(
              (key) => tokensConfig[tokenKey].addresses[key as ChainKey] === tokenAddress
            ) as ChainKey

            return {
              tokenKey,
              chainKey,
              amount: response.values[2][index],
              decimals: response.tokenDecimals[tokenAddress],
            }
          }),
        } as TransformedIncentiveClaims

        // Rename to proofs to proof and return transformed claims
        return { proof: response.proofs, incentiveClaims: transformedClaims } as TransformedUserProofResponse
      },
    }),
  }),
})

export const {
  endpoints: { getUserProofByWallet },
  useGetUserProofByWalletQuery,
} = userProofApi
