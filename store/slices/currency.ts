import { RootState } from '@/store'
import { Currency } from '@/types/Currency'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CurrencyState {
  currency: Currency
}

const initialState: CurrencyState = {
  currency: Currency.USD,
}

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
      state.currency = action.payload
    },
  },
})

export const selectCurrency = (state: RootState) => state.currency.currency
export const { setCurrency } = currencySlice.actions
export const currencyReducer = currencySlice.reducer
