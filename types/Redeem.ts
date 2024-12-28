import { RedeemStepType } from '@/store/slices/stepDialog/slice'

export type RedeemStatus = {
  currentStep: RedeemStepType | null
  isLoading: boolean
}
