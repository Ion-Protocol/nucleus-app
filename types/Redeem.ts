import { RedeemStepType } from '@/store/slices/stepDialog/slice'
import { Address } from 'viem'

export type RedeemStatus = {
  currentStep: RedeemStepType | null
  isLoading: boolean
}

export type RedeemConfig = {
  userAddress: Address
  redeemAmount: bigint
  sharesTokenAddress: `0x${string}`
  wantTokenAddress: `0x${string}`
  destinationChainId: number
  redemptionSourceChainId: number
  isBridgeRequired: boolean
  bridgeData?: any // Replace with proper type
  deadline: bigint
}
