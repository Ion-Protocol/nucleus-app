/**
 * Converts a number to a percentage string.
 * @param value - The number to convert.
 * @returns The percentage string representation of the number.
 */
export function numToPercent(value: number, options?: { fractionDigits?: number }): string {
  const { fractionDigits = 2 } = options || {}
  return `${value.toFixed(fractionDigits)}%`
}
