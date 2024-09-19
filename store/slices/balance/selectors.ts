import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumberAsString } from '@/utils/bigint'

export const selectBalances = (state: RootState): Record<TokenKey, Record<ChainKey, string | null>> => {
  return state.balances.data
}
export const selectBalancesLoading = (state: RootState): boolean => state.balances.loading
export const selectBalancesError = (state: RootState): string | null => state.balances.error

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectTokenBalance = (state: RootState, chainKey: ChainKey | null, tokenKey: TokenKey | null) => {
  const balances = selectBalances(state)
  if (!chainKey || !tokenKey) return null
  const tokenBalance = balances[tokenKey]?.[chainKey] || null
  return tokenBalance
}

// DO NOT memoize: Returns a primitive value; memoization not necessary.
export const selectFormattedTokenBalance = (state: RootState, chainKey: ChainKey | null, tokenKey: TokenKey | null) => {
  const balance = selectTokenBalance(state, chainKey, tokenKey)
  if (balance === null || tokenKey === null || chainKey === null) return '-'
  const balanceAsBigInt = BigInt(balance)
  const balanceAsNumber = bigIntToNumberAsString(balanceAsBigInt, {
    decimals: 18,
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  })
  return `${balanceAsNumber} ${tokensConfig[tokenKey]?.name}`
}
