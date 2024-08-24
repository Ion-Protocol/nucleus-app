import { formatUnits } from 'viem'

export const RAY = {
  bigint: BigInt(1e27),
  number: 1e27,
}

export const WAD = {
  bigint: BigInt(1e18),
  number: 1e18,
}

/**
 * Formats a bigint value as a string with thousands separators and fixed decimal places.
 *
 * @param value - The bigint value to format.
 * @returns The formatted value as a string.
 */
export function bigIntToNumber(
  value: bigint,
  opts: { decimals?: number; minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  const { decimals = 18, minimumFractionDigits = 0, maximumFractionDigits = 3 } = opts
  const numberValue = parseFloat(formatUnits(value, decimals))
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(numberValue)
}

/**
 * Converts a bigint value to USD currency.
 *
 * @param value - The bigint value to convert.
 * @param price - The bigint price to use for conversion.
 * @returns The converted value as a string in USD currency format.
 */
export function bigIntToUsd(value: bigint, opts?: { decimals?: number; digits?: number }): string {
  const { decimals = 18, digits = 0 } = opts || {}
  const formattedValue = Number(value) / 10 ** decimals
  return formattedValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  })
}

/**
 * Converts a BigInt value to a string representation in ETH.
 * @param value - The BigInt value to convert.
 * @returns The string representation of the BigInt value in ETH.
 */
export function bigIntToToken(value: bigint, symbol: string, opts?: { digits?: number }): string {
  return `${bigIntToNumber(value, { maximumFractionDigits: opts?.digits })} ${symbol}`
}
