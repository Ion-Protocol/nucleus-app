import { BridgeKey } from '@/types/BridgeKey'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { bigIntToNumber } from '@/utils/bigint'
import { createSelector } from '@reduxjs/toolkit'
import { TokenKey } from '@/types/TokenKey'

export const selectBalances = (state: RootState): Record<TokenKey, Record<BridgeKey, string | null>> =>
  state.balances.data
export const selectBalancesLoading = (state: RootState): boolean => state.balances.loading
export const selectBalancesError = (state: RootState): string | null => state.balances.error

/**
 * Selects the balance value for a specific token key.
 *
 * @param tokenKey - The key of the token.
 * @returns The balance value for the specified token key.
 */
export const selectTokenBalance = (bridgeKey: BridgeKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectBalances], (balances): string | null => {
    if (!bridgeKey || !tokenKey) return null
    const tokenBalance = balances[tokenKey]?.[bridgeKey] || null
    return tokenBalance
  })

/**
 * Selects the formatted balance for a specific token.
 *
 * @param tokenKey - The key of the token.
 * @returns The formatted balance as a string.
 */
export const selectFormattedTokenBalance = (bridgeKey: BridgeKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectTokenBalance(bridgeKey, tokenKey)], (balance): string => {
    if (balance === null || tokenKey === null || bridgeKey === null) return '-'
    const balanceAsBigInt = BigInt(balance)
    const balanceAsNumber = bigIntToNumber(balanceAsBigInt)
    return `${balanceAsNumber} ${tokensConfig[tokenKey]?.name}`
  })

export const selectTokenBalanceAsNumber = (bridgeKey: BridgeKey | null, tokenKey: TokenKey | null) =>
  createSelector([selectTokenBalance(bridgeKey, tokenKey)], (balance): number | null => {
    return balance ? parseFloat(bigIntToNumber(BigInt(balance))) : null
  })
