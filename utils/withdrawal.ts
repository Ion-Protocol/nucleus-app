import { tokensConfig } from '@/config/tokens'
import { Address } from 'viem'
import { WAD } from './bigint'

export const calculateWithdrawalFee = (amount: bigint, feePercentage: number) => {
  // Convert percentage to WAD-based calculation
  // feePercentage * WAD / 100 gives us the WAD-adjusted percentage
  const feeWad = (BigInt(Math.round(feePercentage * 100)) * WAD.bigint) / BigInt(10000)

  // Multiply amount by fee and divide by WAD to get final amount
  return (amount * feeWad) / WAD.bigint
}

/**
 * Reduces an amount by a fee percentage
 * @param amount - The base amount as a BigInt (in WAD precision)
 * @param feePercentage - The fee percentage as a number (e.g., 0.2 for 0.2%)
 * @returns The amount reduced by the fee percentage
 */
export const applyWithdrawalFeeReduction = (amount: bigint, feePercentage: number): bigint => {
  // Convert percentage to basis points and subtract from 10000
  const basisPoints = BigInt(10000) - BigInt(Math.round(feePercentage * 100))

  // Multiply by adjusted basis points and divide by 10000
  return (amount * basisPoints) / BigInt(10000)
}

const addressToSymbolMap = Object.values(tokensConfig).reduce<Record<string, string>>((map, token) => {
  Object.entries(token.addresses).forEach(([_, address]) => {
    map[address.toLowerCase()] = token.symbol
  })
  return map
}, {})

export const getSymbolByAddress = (address: Address) => {
  return addressToSymbolMap[address.toLowerCase()] || null // Return null if address not found
}
