import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import {
  selectBridgeFrom,
  selectDepositPending,
  selectFromTokenKeyForBridge,
  selectInputError,
  selectSourceBridge,
} from '@/store/slices/bridges'
import { performDeposit } from '@/store/slices/bridges/thunks'
import { BridgeKey } from '@/types/BridgeKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: FunkitBuyOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const loading = selectDepositPending(state)
  const inputError = selectInputError(state)
  const fromChain = selectSourceBridge(state)
  const fromAmount = selectBridgeFrom(state)
  const fromTokenKey = selectFromTokenKeyForBridge(state)
  const fromTokenInfo = fromTokenKey ? tokensConfig[fromTokenKey] : null
  const disabled = !fromAmount.trim()

  return {
    fromAmount,
    fromTokenInfo,
    fromChain,
    bridgeKey,
    loading,
    disabled,
  }
}

const mapDispatch = {
  performDeposit,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface FunkitBuyOwnProps {}

interface FunkitBuyProps extends FunkitBuyOwnProps, PropsFromRedux {}

export namespace FunkitBuyConnector {
  export const Connector = connector
  export type Props = FunkitBuyProps
}
