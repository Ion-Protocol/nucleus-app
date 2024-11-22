import { wagmiConfig } from '@/config/wagmi'
import { CrossChainTellerBaseAbi } from '@/contracts/CrossChainTellerBaseAbi'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address, Hash } from 'viem'
import {
  readContract,
  type ReadContractErrorType,
  waitForTransactionReceipt,
  type WaitForTransactionReceiptErrorType,
  writeContract,
  type WriteContractErrorType,
} from 'wagmi/actions'

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

export interface BridgeArgs extends PreviewFeeArgs {
  fee: bigint
}

export interface PreviewFeeResponse {
  fee: bigint
  feeAsString: string
  truncatedFeeAsString: string
}

type WagmiError = ReadContractErrorType | WriteContractErrorType | WaitForTransactionReceiptErrorType

export const tellerApi = createApi({
  reducerPath: 'previewFeeApi',
  baseQuery: fakeBaseQuery<WagmiError>(),
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
        } catch (err) {
          const error = err as WagmiError
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
    }),
    bridge: builder.mutation<Hash, BridgeArgs>({
      queryFn: async ({ shareAmount, bridgeData, contractAddress, chainId, fee }) => {
        try {
          const hash = await writeContract(wagmiConfig, {
            abi: CrossChainTellerBaseAbi,
            address: contractAddress,
            functionName: 'bridge',
            args: [shareAmount, bridgeData],
            chainId: chainId,
            value: fee,
          })
          const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
            hash,
          })
          return { data: txReceipt.transactionHash }
        } catch (err) {
          const error = err as WagmiError
          return {
            error,
            data: undefined,
            meta: undefined,
          }
        }
      },
    }),
  }),
})

export const { useGetPreviewFeeQuery, useBridgeMutation } = tellerApi
