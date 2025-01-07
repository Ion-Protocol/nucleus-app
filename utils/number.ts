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
  if (parseFloat(input) === 0) {
    return '0'
  }

  // Split the input into the whole number and decimal parts
  const [whole, decimal = ''] = input.split('.')

  // Add the right number of zeroes to the decimal part to match the specified decimals
  const decimalPadded = (decimal + '0'.repeat(decimals)).slice(0, decimals)

  // Return the whole number part concatenated with the decimal part
  return whole + decimalPadded
}

export const formatWithSignificantDecimals = (value: number | string, significantDigits: number = 2): string => {
  // Convert string input to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  // Handle NaN and invalid inputs
  if (isNaN(numValue)) return '0'

  // Handle zero value
  if (numValue === 0) return '0'

  // Convert to string and remove scientific notation
  const str = numValue.toFixed(20)

  // Split into integer and decimal parts
  const [integer, decimal] = str.split('.')

  if (!decimal) return integer

  // Find the first non-zero digit
  const firstNonZeroIndex = decimal.split('').findIndex((digit) => digit !== '0')

  if (firstNonZeroIndex === -1) return integer

  // Keep the leading zeros plus specified number of significant digits after the first non-zero digit
  const significantPart = decimal.substring(0, firstNonZeroIndex + significantDigits)

  // Return formatted number
  return `${integer}.${significantPart}`
}

export function convertFromDecimals(input: string, decimals: number = 18): string {
  if (parseFloat(input) === 0) {
    return '0'
  }

  // Ensure the input is long enough to handle the decimals
  const inputPadded = input.padStart(decimals + 1, '0')

  // Split the string into whole and decimal parts
  const whole = inputPadded.slice(0, -decimals)
  const decimal = inputPadded.slice(-decimals).replace(/0+$/, '') // Remove trailing zeroes

  // If there's no decimal part, just return the whole number
  if (!decimal) {
    return whole
  }

  // Concatenate the whole number and decimal part with a period
  return whole + '.' + decimal
}

export function hasMoreThanNSignificantDigits(value: string, digits: number): boolean {
  // Check if the value is a valid number
  const num = Number(value)
  if (isNaN(num)) {
    return false
  }

  // If the number is 0, it does not have significant digits beyond 1
  if (num === 0) {
    return false
  }

  // Remove leading and trailing zeros and the decimal point
  const significantPart = value.replace(/^0+|\.|0+$/g, '')

  // Count significant digits (ignoring the leading and trailing zeros)
  let significantDigitsCount = 0
  let seenNonZero = false

  for (const char of significantPart) {
    if (char !== '0') {
      seenNonZero = true
    }
    if (seenNonZero) {
      significantDigitsCount++
    }
  }

  // Return true if significant digits exceed the given threshold
  return significantDigitsCount > digits
}

// This function does not work with large numbers greater than 10^9, which is
// far more than the entire ETH supply anyway
export function truncateToSignificantDigits(numStr: string, significantDigits: number): string {
  let num = parseFloat(numStr) // Convert the input string to a number

  if (isNaN(num)) {
    throw new Error('Invalid input: not a valid number')
  }

  // Handle case where the number is 0
  if (num === 0) {
    return num.toFixed(significantDigits - 1) // Return zero with the specified number of digits
  }

  // Determine how many digits the number has before the decimal
  const magnitude = Math.floor(Math.log10(Math.abs(num))) + 1

  // Calculate the factor to truncate the number to the desired significant digits
  const factor = Math.pow(10, significantDigits - magnitude)

  // Truncate the number without rounding up
  const truncatedNum = Math.floor(num * factor) / factor

  // Convert back to a string without scientific notation and remove extra decimals
  let truncatedStr = truncatedNum.toLocaleString('fullwide', { useGrouping: false, maximumFractionDigits: 20 })

  // Handle cases where unnecessary decimals appear (like ".000" at the end)
  if (truncatedStr.includes('.')) {
    // Remove trailing zeros after decimal point
    truncatedStr = truncatedStr.replace(/\.?0+$/, '')
  }

  return truncatedStr
}
