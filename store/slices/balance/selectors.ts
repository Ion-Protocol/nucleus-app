import { RootState } from '@/store'
import { BalancesState } from './slice'
import { formatUnits } from 'viem'

/**
 * Selects the data property from the balances state.
 * @param {RootState} state - The root state of the application.
 * @returns {string} The data property of the balances state.
 */
export function selectWeEthBalanceData(state: RootState): string {
  return state.balances.data
}

/**
 * Selects the loading property from the balances state.
 * @param {RootState} state - The root state of the application.
 * @returns {boolean} The loading property of the balances state.
 */
export function selectWeEthBalanceLoading(state: RootState): boolean {
  return state.balances.loading
}

/**
 * Selects the error property from the balances state.
 * @param {RootState} state - The root state of the application.
 * @returns {string | null} The error property of the balances state.
 */
export function selectWeEthBalanceError(state: RootState): string | null {
  return state.balances.error
}

/**
 * Selects the data property from the balances state and formats it to 2 decimal places.
 * @param {RootState} state - The root state of the application.
 * @returns {string} The formatted data property of the balances state.
 */
export function selectFormattedWeEthBalance(state: RootState): string {
  let weEthBalance = selectWeEthBalanceData(state)
  const weEthBalaceAsBigInt = BigInt(weEthBalance)
  const weEthBalanceFormatted = parseFloat(formatUnits(weEthBalaceAsBigInt, 18)).toFixed(2)
  return weEthBalanceFormatted
}

/**
 * Selects the formatted data property from the balances state and appends the unit 'weETH'.
 * @param {RootState} state - The root state of the application.
 * @returns {string} The formatted data property of the balances state with unit.
 */
export function selectWeEthBalanceWithUnit(state: RootState): string {
  const weEthBalanceFormatted = selectFormattedWeEthBalance(state)
  const weEthBalanceWithUnit = `${weEthBalanceFormatted} weETH`
  return weEthBalanceWithUnit
}
