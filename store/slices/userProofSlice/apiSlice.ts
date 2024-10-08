import { tokensConfig } from '@/config/tokens'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface RawUserProofResponse {
  proofs: `0x${string}`[]
  values: [`0x${string}`, `0x${string}`[], string[]]
}

export interface TransformedUserProofResponse {
  proof: `0x${string}`[]
  incentiveClaims: TransformedIncentiveClaims
}

export interface TransformedIncentiveClaims {
  userAddress: `0x${string}`
  tokenAmounts: { tokenKey: TokenKey; chainKey: ChainKey; amount: string }[]
}

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

export const userProofApi = createApi({
  reducerPath: 'userProofApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/staging`,
  }),
  endpoints: (builder) => ({
    getUserProofByWallet: builder.query({
      query: ({ walletAddress, chainId }) => `userProof?walletAddress=${walletAddress}&chainId=${chainId}`,
      keepUnusedDataFor: 300, // 5 minutes (quantified as seconds)
      transformResponse: (response: RawUserProofResponse) => {
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
              chainKey, // Include the chainKey in the returned object
              amount: response.values[2][index],
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
