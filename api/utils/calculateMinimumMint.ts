import { mintSlippage } from '@/config/constants'
import { WAD } from '@/utils/bigint'

export function calculateMinimumMint(depositAmount: bigint, rate: bigint): bigint {
  const slippageAsBigInt = BigInt(mintSlippage * WAD.number)
  const minimumMint = (depositAmount * WAD.bigint) / rate
  const slippageAmount = (minimumMint * slippageAsBigInt) / WAD.bigint
  return minimumMint - slippageAmount
}
