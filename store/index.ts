import { configureStore } from '@reduxjs/toolkit'
import { debounceMiddleware } from './middleware/debounceMiddleware'
import { chainChangeMiddleware } from './middleware/effects/chainChangeMiddleware'
import { previewFeeMiddleware } from './middleware/effects/previewFeeMiddleware'
import { accountReducer } from './slices/account/slice'
import { balancesReducer } from './slices/balance'
import { bridgesReducer } from './slices/bridges'
import { chainReducer } from './slices/chain/slice'
import { currencyReducer } from './slices/currency/slice'
import { netApyReducer } from './slices/netApy'
import { netApyApi } from './slices/netApy/api'
import { priceReducer } from './slices/price'
import { routerReducer } from './slices/router/slice'
import { statusReducer } from './slices/status/slice'
import { UIReducer } from './slices/ui/slice'

const regularMiddlewares = [netApyApi.middleware, debounceMiddleware]
const sideEffectMiddlewares = [previewFeeMiddleware, chainChangeMiddleware]

export const store = configureStore({
  reducer: {
    account: accountReducer,
    balances: balancesReducer,
    bridges: bridgesReducer,
    chain: chainReducer,
    currency: currencyReducer,
    netApy: netApyReducer,
    price: priceReducer,
    router: routerReducer,
    status: statusReducer,
    ui: UIReducer,

    // API reducers
    [netApyApi.reducerPath]: netApyApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(regularMiddlewares).concat(sideEffectMiddlewares),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
