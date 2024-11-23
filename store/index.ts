import { configureStore } from '@reduxjs/toolkit'
import { accountantApi, atomicQueueApi, coinGeckoApi, erc20Api, tellerApi, transactionReceiptApi } from './api'
import { debounceMiddleware } from './middleware/debounceMiddleware'
import { termsAcceptedMiddleware } from './middleware/effects/acceptTermsMiddleware'
import { previewFeeMiddleware } from './middleware/effects/previewFeeMiddleware'
import { sideEffectMiddleware } from './middleware/effects/sideEffectMiddleware'
import { accountReducer } from './slices/account/slice'
import { balancesReducer } from './slices/balance'
import { networkReducer } from './slices/chain/slice'
import { networkAssetsReducer } from './slices/networkAssets'
import { priceReducer } from './slices/price'
import { redstoneApi } from './slices/redstoneSlice/apiSlice'
import { routerReducer } from './slices/router/slice'
import { statusReducer } from './slices/status/slice'
import { dialogReducer } from './slices/stepDialog/slice'
import { UIReducer } from './slices/ui/slice'
import { userProofApi } from './slices/userProofSlice/apiSlice'

import { nucleusIncentivesApi } from './api/incentivesApi'
import { nucleusBackendApi } from './api/nucleusBackendApi'
const regularMiddlewares = [debounceMiddleware]
const sideEffectMiddlewares = [previewFeeMiddleware, sideEffectMiddleware, termsAcceptedMiddleware]
const apiMiddlewares = [
  userProofApi.middleware,
  redstoneApi.middleware,
  tellerApi.middleware,
  accountantApi.middleware,
  atomicQueueApi.middleware,
  erc20Api.middleware,
  transactionReceiptApi.middleware,
  coinGeckoApi.middleware,
  nucleusBackendApi.middleware,
  nucleusIncentivesApi.middleware,
]

// Configure the store and inject the LibraryContext as an extra argument for thunks
export const store = configureStore({
  reducer: {
    account: accountReducer,
    dialog: dialogReducer,
    balances: balancesReducer,
    networkAssets: networkAssetsReducer,
    network: networkReducer,
    price: priceReducer,
    router: routerReducer,
    status: statusReducer,
    ui: UIReducer,

    // Api slices
    [userProofApi.reducerPath]: userProofApi.reducer,
    [redstoneApi.reducerPath]: redstoneApi.reducer,
    [tellerApi.reducerPath]: tellerApi.reducer,
    [accountantApi.reducerPath]: accountantApi.reducer,
    [atomicQueueApi.reducerPath]: atomicQueueApi.reducer,
    [erc20Api.reducerPath]: erc20Api.reducer,
    [transactionReceiptApi.reducerPath]: transactionReceiptApi.reducer,
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
    [nucleusBackendApi.reducerPath]: nucleusBackendApi.reducer,
    [nucleusIncentivesApi.reducerPath]: nucleusIncentivesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      //   isSerializable: (value: unknown) =>
      //     isPlainObject(value) ||
      //     Array.isArray(value) ||
      //     typeof value === 'string' ||
      //     typeof value === 'number' ||
      //     typeof value === 'boolean' ||
      //     typeof value === 'undefined' ||
      //     value === null ||
      //     typeof value === 'bigint',
      //   serialize: (value: unknown) => serialize(value),
      //   deserialize: (value: string) => deserialize(value),
      // },
    }).concat(...regularMiddlewares, ...sideEffectMiddlewares, ...apiMiddlewares),
  devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
