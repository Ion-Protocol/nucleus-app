import { RootState } from '@/store'

export const selectLiquidities = (state: RootState) => state.ionLens.liquidities
export const selectIonLensLoading = (state: RootState) => state.ionLens.loading
export const selectIonLensError = (state: RootState) => state.ionLens.error
