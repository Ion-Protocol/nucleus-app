import { configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './slices/counter'
import { accountReducer } from './slices/account'
import { balancesReducer } from './slices/balance'
import { statusReducer } from './slices/status'
import { UIReducer } from './slices/ui'
import { currencyReducer } from './slices/currency'
import { bridgesReducer } from './slices/bridges'
import { priceReducer } from './slices/price'
import { routerReducer } from './slices/router'
import { chainReducer } from './slices/chain'
import { netApyReducer } from './slices/netApy'
import { netApyApi } from './slices/netApy/api'
import { positionsReducer } from './slices/positions'
import { positionsApi } from './slices/positions/api'
import { assetApysReducer } from './slices/assetApys'
import { assetApysApi } from './slices/assetApys/api'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    assetApys: assetApysReducer,
    balances: balancesReducer,
    bridges: bridgesReducer,
    chain: chainReducer,
    counter: counterReducer,
    currency: currencyReducer,
    netApy: netApyReducer,
    positions: positionsReducer,
    price: priceReducer,
    router: routerReducer,
    status: statusReducer,
    ui: UIReducer,

    // API reducers
    [netApyApi.reducerPath]: netApyApi.reducer,
    [positionsApi.reducerPath]: positionsApi.reducer,
    [assetApysApi.reducerPath]: assetApysApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(netApyApi.middleware, positionsApi.middleware, assetApysApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
