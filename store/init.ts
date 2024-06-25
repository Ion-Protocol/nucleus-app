import { BridgeKey } from '@/config/bridges'
import { AppDispatch } from '.'
import { fetchAllTokenBalances } from './slices/balance'
import { fetchLiquidityForAllMarkets } from './slices/ionLens'
import { fetchTotalSupplyForAllMarkets, fetchCurrentBorrowRateForAllMarkets } from './slices/ionPool'
import { fetchEthPrice } from './slices/price'
import { fetchBridgeTvl, fetchBridgeApy, fetchBridgeRate } from './slices/bridges/thunks'

export function init(dispatch: AppDispatch) {
  dispatch(fetchEthPrice())
  dispatch(fetchLiquidityForAllMarkets())
  dispatch(fetchTotalSupplyForAllMarkets())
  dispatch(fetchCurrentBorrowRateForAllMarkets())
  dispatch(fetchAllTokenBalances())

  Object.values(BridgeKey).forEach((key) => {
    dispatch(fetchBridgeTvl(key))
    dispatch(fetchBridgeApy(key))
    dispatch(fetchBridgeRate(key))
  })
}
