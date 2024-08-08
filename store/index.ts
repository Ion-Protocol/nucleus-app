import { configureStore } from '@reduxjs/toolkit'
import { debounceMiddleware } from './middleware/debounceMiddleware'
import { accountReducer } from './slices/account/slice'
import { assetApysReducer } from './slices/assetApys'
import { assetApysApi } from './slices/assetApys/api'
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
import { previewFeeMiddleware } from './middleware/effects/previewFeeMiddleware'
import { chainChangeMiddleware } from './middleware/effects/chainChangeMiddleware'

const regularMiddlewares = [netApyApi.middleware, assetApysApi.middleware, debounceMiddleware]
const sideEffectMiddlewares = [previewFeeMiddleware, chainChangeMiddleware]

export const store = configureStore({
  reducer: {
    account: accountReducer,
    assetApys: assetApysReducer,
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
    [assetApysApi.reducerPath]: assetApysApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(regularMiddlewares).concat(sideEffectMiddlewares),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
