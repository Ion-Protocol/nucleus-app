import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './slices/counter'
import { accountReducer } from './slices/account'
import { balancesReducer } from './slices/balance'
import { statusReducer } from './slices/status'
import { UIReducer } from './slices/ui'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    ui: UIReducer,
    balances: balancesReducer,
    counter: counterReducer,
    status: statusReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
