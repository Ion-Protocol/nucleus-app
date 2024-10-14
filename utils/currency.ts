import { bigIntToUsd } from './bigint'
import { convertToDecimals, numberToUsd } from './number'

export function convertToUsd(
  value: bigint | number | string | null,
  price: bigint,
  opts?: { usdDigits?: number }
): string {
  const { usdDigits = 0 } = opts || {}
  if (value === null) {
    value = BigInt(0)
  }

  if (typeof value === 'bigint') {
    const usdValue = (value * price) / BigInt(1e8)
    return bigIntToUsd(usdValue, { digits: usdDigits })
  } else if (typeof value === 'string') {
    const valueAsNumber = parseFloat(convertToDecimals(value))
    return numberToUsd(valueAsNumber, price, { digits: usdDigits })
  } else {
    return numberToUsd(value, price, { digits: usdDigits })
  }
}
