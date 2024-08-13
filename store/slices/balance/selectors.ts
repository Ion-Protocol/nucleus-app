import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { bigIntToNumber } from '@/utils/bigint'
import { createSelector } from '@reduxjs/toolkit'

export const selectBalances = (state: RootState): Record<TokenKey, string> => state.balances.data
export const selectBalancesLoading = (state: RootState): boolean => state.balances.loading
export const selectBalancesError = (state: RootState): string | null => state.balances.error

/**
 * Selects the balance value for a specific token key.
 *
 * @param tokenKey - The key of the token.
 * @returns The balance value for the specified token key.
 */
export const selectTokenBalance = (tokenKey: TokenKey | null) =>
  createSelector([selectBalances], (balances): string => {
    if (!tokenKey) return '0'
    return balances[tokenKey]
  })

/**
 * Selects the formatted balance for a specific token.
 *
 * @param tokenKey - The key of the token.
 * @returns The formatted balance as a string.
 */
export const selectFormattedTokenBalance = (tokenKey: TokenKey) =>
  createSelector([selectTokenBalance(tokenKey)], (balance): string => {
    const balanceAsBigInt = BigInt(balance)
    const balanceAsNumber = bigIntToNumber(balanceAsBigInt)
    return `${balanceAsNumber} ${tokensConfig[tokenKey]?.name}`
  })
