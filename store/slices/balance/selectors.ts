import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumberAsString } from '@/utils/bigint'
import { createSelector } from '@reduxjs/toolkit'

export const selectBalances = (state: RootState): Record<TokenKey, Record<ChainKey, string | null>> =>
  state.balances.data
export const selectBalancesLoading = (state: RootState): boolean => state.balances.loading
export const selectBalancesError = (state: RootState): string | null => state.balances.error

/**
 * Selects the balance value for a specific token key.
 *
 * @param tokenKey - The key of the token.
 * @returns The balance value for the specified token key.
 */
export const selectTokenBalance = (chainKey: ChainKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectBalances], (balances): string | null => {
    if (!chainKey || !tokenKey) return null
    const tokenBalance = balances[tokenKey]?.[chainKey] || null
    return tokenBalance
  })

/**
 * Selects the formatted balance for a specific token.
 *
 * @param tokenKey - The key of the token.
 * @returns The formatted balance as a string.
 */
export const selectFormattedTokenBalance = (chainKey: ChainKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectTokenBalance(chainKey, tokenKey)], (balance): string => {
    if (balance === null || tokenKey === null || chainKey === null) return '-'
    const balanceAsBigInt = BigInt(balance)
    const balanceAsNumber = bigIntToNumberAsString(balanceAsBigInt, {
      decimals: 18,
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    })
    return `${balanceAsNumber} ${tokensConfig[tokenKey]?.name}`
  })

export const selectTokenBalanceAsNumber = (chainKey: ChainKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectTokenBalance(chainKey, tokenKey)], (balance): number | null => {
    return balance ? parseFloat(bigIntToNumberAsString(BigInt(balance))) : null
  })
