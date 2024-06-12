import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './slices/counter'
import { accountReducer } from './slices/account'
import { balancesReducer } from './slices/balance'
import { statusReducer } from './slices/status'
import { UIReducer } from './slices/ui'
import { currencyReducer } from './slices/currency'
import { bridgesReducer } from './slices/bridges'
import { priceReducer } from './slices/price'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    balances: balancesReducer,
    bridges: bridgesReducer,
    counter: counterReducer,
    currency: currencyReducer,
    price: priceReducer,
    status: statusReducer,
    ui: UIReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
