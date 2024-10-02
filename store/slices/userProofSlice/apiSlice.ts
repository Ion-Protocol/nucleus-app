import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT

export const userProofApiSlice = createApi({
  reducerPath: 'userProofApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/staging`,
  }),
  endpoints: (builder) => ({
    getUserProofByWallet: builder.query({
      query: ({ walletAddress, chainId }) => `userProof?walletAddress=${walletAddress}&chainId=${chainId}`,
      keepUnusedDataFor: 300, // 5 minutes (quantified as seconds)
    }),
  }),
})
