import { configureStore, isPlainObject } from '@reduxjs/toolkit'
import { debounceMiddleware } from './middleware/debounceMiddleware'
import { termsAcceptedMiddleware } from './middleware/effects/acceptTermsMiddleware'
import { sideEffectMiddleware } from './middleware/effects/sideEffectMiddleware'
import { previewFeeMiddleware } from './middleware/effects/previewFeeMiddleware'
import { accountReducer } from './slices/account/slice'
import { balancesReducer } from './slices/balance'
import { networkAssetsReducer } from './slices/networkAssets'
import { networkReducer } from './slices/chain/slice'
import { priceReducer } from './slices/price'
import { routerReducer } from './slices/router/slice'
import { statusReducer } from './slices/status/slice'
import { UIReducer } from './slices/ui/slice'
import { userProofApi } from './slices/userProofSlice/apiSlice'
import { redstoneApi } from './slices/redstoneSlice/apiSlice'
import { dialogReducer } from './slices/stepDialog/slice'
import { previewFeeApi } from './api/Teller/previewFeeApi'
import { serialize } from 'wagmi'
import { rateInQuoteSafeApi } from './api/Accountant/rateInQuoteSafeApi'
import { deserialize } from 'wagmi'

const regularMiddlewares = [debounceMiddleware]
const sideEffectMiddlewares = [previewFeeMiddleware, sideEffectMiddleware, termsAcceptedMiddleware]
const apiMiddlewares = [
  userProofApi.middleware,
  redstoneApi.middleware,
  previewFeeApi.middleware,
  rateInQuoteSafeApi.middleware,
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
    [previewFeeApi.reducerPath]: previewFeeApi.reducer,
    [rateInQuoteSafeApi.reducerPath]: rateInQuoteSafeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (value: unknown) =>
          isPlainObject(value) ||
          Array.isArray(value) ||
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          typeof value === 'undefined' ||
          value === null ||
          typeof value === 'bigint',
        serialize: (value: unknown) => serialize(value),
        deserialize: (value: string) => deserialize(value),
      },
    }).concat(...regularMiddlewares, ...sideEffectMiddlewares, ...apiMiddlewares),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
