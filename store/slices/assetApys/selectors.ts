import { RootState } from '@/store'

// Existing selectors
export const selectAssetApys = (state: RootState) => state.assetApys.data
export const selectAssetApysLoading = (state: RootState) => state.assetApys.loading
export const selectAssetApysError = (state: RootState) => state.assetApys.error
