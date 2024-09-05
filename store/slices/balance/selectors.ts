import { ChainKey } from '@/types/ChainKey'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { bigIntToNumber } from '@/utils/bigint'
import { createSelector } from '@reduxjs/toolkit'
import { TokenKey } from '@/types/TokenKey'
import { selectDepositAmountAsBigInt, selectSourceChainKey, selectSourceTokenKey } from '../bridges'

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
    const balanceAsNumber = bigIntToNumber(balanceAsBigInt)
    return `${balanceAsNumber} ${tokensConfig[tokenKey]?.name}`
  })

export const selectTokenBalanceAsNumber = (chainKey: ChainKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectTokenBalance(chainKey, tokenKey)], (balance): number | null => {
    return balance ? parseFloat(bigIntToNumber(BigInt(balance))) : null
  })
