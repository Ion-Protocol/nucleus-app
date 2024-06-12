import { formatUnits } from 'viem'

/**
 * Formats a bigint value as a string with thousands separators and fixed decimal places.
 *
 * @param value - The bigint value to format.
 * @returns The formatted value as a string.
 */
export function bigIntToNumber(value: bigint, decimals = 18): string {
  const numberValue = parseFloat(formatUnits(value, decimals))
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(numberValue)
}

/**
 * Converts a BigInt value to a percentage string.
 * @param value - The BigInt value to convert.
 * @returns The percentage string representation of the BigInt value.
 */
export function bigIntToPercent(value: bigint, decimals = 18): string {
  const numberValue = parseFloat(formatUnits(value, decimals)).toFixed(2)
  return `${numberValue}%`
}

/**
 * Converts a bigint value to USD currency.
 *
 * @param value - The bigint value to convert.
 * @param price - The bigint price to use for conversion.
 * @returns The converted value as a string in USD currency format.
 */
export function bigIntToUsd(value: bigint, decimals = 18): string {
  const formattedValue = value / BigInt(10 ** decimals)
  return formattedValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

/**
 * Converts a BigInt value to a string representation in ETH.
 * @param value - The BigInt value to convert.
 * @returns The string representation of the BigInt value in ETH.
 */
export function bigIntToEth(value: bigint): string {
  return `${bigIntToNumber(value)} ETH`
}
