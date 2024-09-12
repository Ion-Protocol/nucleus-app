import { RootState } from '@/store'

export function selectUsdPerEthRate(state: RootState): bigint {
  return BigInt(state.price.usdPerEthRate)
}

export function selectUsdPerBtcRate(state: RootState): bigint {
  return BigInt(state.price.usdPerBtcRate)
}

export function selectPriceLoading(state: RootState): boolean {
  return state.balances.loading
}

export function selectPriceError(state: RootState): string | null {
  return state.balances.error
}
