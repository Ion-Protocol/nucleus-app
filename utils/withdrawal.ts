import { tokensConfig } from '@/config/tokens'
import { Address } from 'viem'
import { WAD } from './bigint'

export const calculateWithdrawSlippage = (amount: bigint, slippagePercentage: number) => {
  // Convert percentage to WAD-based calculation
  // slippagePercentage * WAD / 100 gives us the WAD-adjusted percentage
  const slippageWad = (BigInt(Math.round(slippagePercentage * 100)) * WAD.bigint) / BigInt(10000)

  // Multiply amount by slippage and divide by WAD to get final amount
  return (amount * slippageWad) / WAD.bigint
}

/**
 * Reduces an amount by a slippage percentage
 * @param amount - The base amount as a BigInt (in WAD precision)
 * @param slippagePercentage - The slippage percentage as a number (e.g., 0.2 for 0.2%)
 * @returns The amount reduced by the slippage percentage
 */
export const applyWithdrawSlippageReduction = (amount: bigint, slippagePercentage: number): bigint => {
  // Convert percentage to basis points and subtract from 10000
  const basisPoints = BigInt(10000) - BigInt(Math.round(slippagePercentage * 100))

  // Multiply by adjusted basis points and divide by 10000
  return (amount * basisPoints) / BigInt(10000)
}

const addressToSymbolMap = Object.values(tokensConfig).reduce<Record<string, string>>((map, token) => {
  Object.entries(token.addresses).forEach(([_, address]) => {
    map[address.toLowerCase()] = token.name
  })
  return map
}, {})

export const getSymbolByAddress = (address: Address) => {
  return addressToSymbolMap[address.toLowerCase()] || null // Return null if address not found
}
