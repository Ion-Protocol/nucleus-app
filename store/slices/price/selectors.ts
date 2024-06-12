import { RootState } from '@/store'
import { utils } from '@/utils'

/**
 * Selects the data property from the balances state.
 * @param {RootState} state - The root state of the application.
 * @returns {string} The data property of the balances state.
 */
export function selectPrice(state: RootState): bigint {
  return BigInt(state.price.data)
}

/**
 * Selects the loading property from the balances state.
 * @param {RootState} state - The root state of the application.
 * @returns {boolean} The loading property of the balances state.
 */
export function selectPriceLoading(state: RootState): boolean {
  return state.balances.loading
}

/**
 * Selects the error property from the balances state.
 * @param {RootState} state - The root state of the application.
 * @returns {string | null} The error property of the balances state.
 */
export function selectPriceError(state: RootState): string | null {
  return state.balances.error
}

/**
 * Selects the data property from the balances state and formats it to 4 decimal places.
 * @param {RootState} state - The root state of the application.
 * @returns {string} The formatted data property of the balances state.
 */
export function selectFormattedPrice(state: RootState): string {
  let price = selectPrice(state)
  const priceAsBigInt = BigInt(price)
  const priceFormatted = utils.formatBigInt(priceAsBigInt)
  return priceFormatted
}
