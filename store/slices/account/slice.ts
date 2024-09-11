import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ==================
// 1. STATE INTERFACE
// ==================
interface AccountSlice {
  address: `0x${string}` | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: AccountSlice = {
  address: null,
}

// ==================
// 3. REDUCERS
// ==================
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<`0x${string}`>) => {
      state.address = action.payload
    },
    clearAddress: (state) => {
      state.address = null
    },
  },
})

// ==================
// 4. HELPFUL EXPORTS
// ==================
export const { setAddress, clearAddress } = accountSlice.actions
export const selectAddress = (state: RootState) => state.account.address

export const accountReducer = accountSlice.reducer
