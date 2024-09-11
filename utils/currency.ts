import { Currency } from '@/types/Currency'
import { bigIntToToken, bigIntToUsd } from './bigint'
import { numberToToken, numberToUsd } from './number'

/**
 * Converts a value to a formatted currency string based on the given currency code.
 * @param value - The value to be converted.
 * @param price - The price in USD for the conversion.
 * @param opts - Optional configuration object.
 * @returns The formatted currency string.
 */
export function currencySwitch(
  value: bigint | number | null,
  price: bigint,
  opts?: { usdDigits?: number; ethDigits?: number }
): string {
  const { usdDigits = 0, ethDigits = 0 } = opts || {}
  if (value === null) {
    value = BigInt(0)
  }

  if (typeof value === 'bigint') {
    const usdValue = (value * price) / BigInt(1e8)
    return bigIntToUsd(usdValue, { digits: usdDigits })
  } else {
    return numberToUsd(value, price, { digits: usdDigits })
  }
}
