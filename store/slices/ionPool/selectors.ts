import { RootState } from '@/store'

export const selectTotalSupplies = (state: RootState) => state.ionPool.totalSupplies
export const selectCurrentBorrowRates = (state: RootState) => state.ionPool.currentBorrowRates
export const selectIonPoolLoading = (state: RootState) => state.ionPool.loading
export const selectIonPoolError = (state: RootState) => state.ionPool.error
