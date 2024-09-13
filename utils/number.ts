/**
 * Converts a number value to USD currency.
 *
 * @param value - The number value to convert.
 * @param price - The price to use for conversion.
 * @returns The converted value as a string in USD currency format.
 */
export function numberToUsd(value: number, price: bigint, opts?: { digits?: number }): string {
  const { digits = 0 } = opts || {}
  const usdValue = (value * Number(price)) / 1e8
  return usdValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  })
}

/**
 * Converts a number value to a string representation in ETH.
 * @param value - The number value to convert.
 * @returns The string representation of the number value in ETH.
 */
export function numberToToken(value: number, symbol: string, opts?: { digits?: number }): string {
  const { digits = 3 } = opts || {}
  return `${value.toFixed(digits)} ${symbol}`
}

export function numberToPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function abbreviateNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`
  } else {
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
  }
}

export function convertToDecimals(input: string, decimals: number = 18): string {
  // Split the input into the whole number and decimal parts
  const [whole, decimal = ''] = input.split('.')

  // Add the right number of zeroes to the decimal part to match the specified decimals
  const decimalPadded = (decimal + '0'.repeat(decimals)).slice(0, decimals)

  // Return the whole number part concatenated with the decimal part
  return whole + decimalPadded
}
