import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './slices/counter'
import { accountReducer } from './slices/account'
import { balancesReducer } from './slices/balance'
import { statusReducer } from './slices/status'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    balances: balancesReducer,
    account: accountReducer,
    status: statusReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
