import { bigIntToEth, bigIntToUsd } from './bigint'
import { numberToEth, numberToUsd } from './number'

/**
 * Converts a value to a formatted currency string based on the given currency code.
 * @param currency - The currency code.
 * @param value - The value to be converted.
 * @returns The formatted currency string.
 */
export function currencySwitch(currency: string, value: bigint | number | null, price: bigint): string | null {
  if (!value) {
    value = 0
  }
  switch (currency) {
    case 'USD':
      if (typeof value === 'bigint') {
        const usdValue = (value * price) / BigInt(1e8)
        return bigIntToUsd(usdValue)
      } else {
        return numberToUsd(value, price)
      }
    case 'ETH':
      return typeof value === 'bigint' ? bigIntToEth(value) : numberToEth(value)
    default:
      return ''
  }
}
