import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address } from 'viem'
import { CrossChainTellerBaseAbi } from '@/contracts/CrossChainTellerBaseAbi'
import { serialize } from 'wagmi'
import { wagmiConfig } from '@/config/wagmi'
import {
  readContract,
  type ReadContractReturnType,
  type ReadContractErrorType,
  type ReadContractParameters,
  writeContract,
  simulateContract,
  type WriteContractReturnType,
  type WriteContractParameters,
  type WriteContractErrorType,
  waitForTransactionReceipt,
} from 'wagmi/actions'

import { bigIntToNumberAsString } from '@/utils/bigint'

export type BridgeData =
  | {
      chainSelector: number
      destinationChainReceiver: Address
      bridgeFeeToken: Address
      messageGas: bigint
      data: `0x${string}`
    }
  | never

export interface PreviewFeeArgs {
  shareAmount: bigint
  bridgeData: BridgeData
  contractAddress: Address
  chainId: number
}

export type PreviewFeeResponse = {
  fee: bigint
  feeAsString: string
  truncatedFeeAsString: string
}

export const tellerApi = createApi({
  reducerPath: 'previewFeeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['PreviewFee'],
  endpoints: (builder) => ({
    getPreviewFee: builder.query<PreviewFeeResponse, PreviewFeeArgs>({
      queryFn: async ({ shareAmount, bridgeData, contractAddress, chainId }) => {
        try {
          const data = await readContract(wagmiConfig, {
            abi: CrossChainTellerBaseAbi,
            address: contractAddress,
            functionName: 'previewFee',
            args: [shareAmount, bridgeData],
            chainId: chainId,
          })
          return {
            data: {
              fee: data,
              feeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 18 }),
              truncatedFeeAsString: bigIntToNumberAsString(data, { maximumFractionDigits: 4 }),
            },
          }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
    }),
    bridge: builder.mutation<
      `0x${string}`,
      { shareAmount: bigint; bridgeData: BridgeData; contractAddress: Address; chainId: number; fee: bigint }
    >({
      queryFn: async ({ shareAmount, bridgeData, contractAddress, chainId, fee }) => {
        try {
          const results = await writeContract(wagmiConfig, {
            abi: CrossChainTellerBaseAbi,
            address: contractAddress,
            functionName: 'bridge',
            args: [shareAmount, bridgeData],
            chainId: chainId,
            value: fee,
          })

          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash: results,
          })
          return { data: txReceipt.transactionHash }
        } catch (error) {
          return { error: serialize(error) }
        }
      },
    }),
  }),
})

export const { useGetPreviewFeeQuery, useBridgeMutation } = tellerApi
