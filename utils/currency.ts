import { formatUnits } from 'viem'
import { bigIntToEth, bigIntToNumber, bigIntToUsd } from './bigint'

/**
 * Converts a value to a formatted currency string based on the given currency code.
 * @param currency - The currency code.
 * @param value - The value to be converted.
 * @returns The formatted currency string.
 */
export function currencySwitch(currency: string, value: bigint, price: bigint) {
  switch (currency) {
    case 'USD':
      const usdValue = (value * price) / BigInt(1e8)
      return bigIntToUsd(usdValue)
    case 'ETH':
      return bigIntToEth(value)
    default:
      return ''
  }
}
