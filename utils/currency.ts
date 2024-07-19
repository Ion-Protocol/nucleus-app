import { bigIntToEth, bigIntToUsd } from './bigint'
import { numberToEth, numberToUsd } from './number'

/**
 * Converts a value to a formatted currency string based on the given currency code.
 * @param currency - The currency code.
 * @param value - The value to be converted.
 * @param price - The price in USD for the conversion.
 * @param opts - Optional configuration object.
 * @returns The formatted currency string.
 */
export function currencySwitch(
  currency: string,
  value: bigint | number | null,
  price: bigint,
  opts?: { usdDigits?: number; ethDigits?: number }
): string | null {
  const { usdDigits = 0, ethDigits = 0 } = opts || {}
  if (!value) return null

  switch (currency) {
    case 'USD':
      if (typeof value === 'bigint') {
        const usdValue = (value * price) / BigInt(1e8)
        return bigIntToUsd(usdValue, { digits: usdDigits })
      } else {
        return numberToUsd(value, price, { digits: usdDigits })
      }
    case 'ETH':
      if (typeof value === 'bigint') {
        return bigIntToEth(value, { digits: ethDigits })
      } else {
        return numberToEth(value, { digits: ethDigits })
      }
    default:
      return ''
  }
}
