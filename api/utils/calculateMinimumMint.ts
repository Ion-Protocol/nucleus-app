import { WAD } from '@/utils/bigint'

export function calculateMinimumMint(depositAmount: bigint, rate: bigint): bigint {
  return (depositAmount * WAD.bigint) / rate
}
