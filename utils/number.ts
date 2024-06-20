/**
 * Converts a number to a percentage string.
 * @param value - The number to convert.
 * @returns The percentage string representation of the number.
 */
export function numToPercent(value: number, options?: { fractionDigits?: number }): string {
  const { fractionDigits = 2 } = options || {}
  return `${value.toFixed(fractionDigits)}%`
}

/**
 * Generates an array of evenly spaced floats.
 *
 * @param {number} max - The maximum number (inclusive) for the array.
 * @param {number} count - The number of evenly spaced floats to generate.
 * @returns {number[]} An array of evenly spaced floats from 0 to max.
 *
 * @example
 * ```typescript
 * const result = generateEvenlySpacedFloats(10, 5);
 * console.log(result); // Output: [0, 2.5, 5, 7.5, 10]
 * ```
 */
export function generateEvenlySpacedFloats(max: number, count: number): number[] {
  if (count < 2) {
    throw new Error('Count must be at least 2 to generate evenly spaced floats.')
  }

  const step = max / (count - 1)
  return Array.from({ length: count }, (_, i) => i * step)
}

/**
 * Returns an array of evenly spaced integers.
 * @param max - The maximum number.
 * @param count - The number of values to return.
 * @returns An array of evenly spaced integers.
 */
export function generateEvenlySpacedIntegers(max: number, count: number): number[] {
  const result: number[] = []
  const interval = Math.round(max / count)
  if (interval === 0) {
    return [max]
  }

  for (let i = 1; i * interval < max; i++) {
    result.push(i * interval)
  }

  return result
}

/**
 * Returns the maximum number in an array.
 * @param numbers - An array of numbers.
 * @returns The maximum number in the array.
 */
export function getMaxNumber(numbers: number[]): number | undefined {
  if (numbers.length === 0) {
    return undefined
  }

  return Math.max(...numbers)
}
