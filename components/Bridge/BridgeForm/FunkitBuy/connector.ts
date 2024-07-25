import { BridgeKey } from '@/config/bridges'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import {
  selectBridgeFrom,
  selectBridgeSourceChain,
  selectDepositError,
  selectDepositPending,
  selectFromTokenKeyForBridge,
  selectInputError,
} from '@/store/slices/bridges'
import { performDeposit } from '@/store/slices/bridges/thunks'
import { useFunkitCheckout } from '@funkit/connect'
import { ConnectedProps, connect } from 'react-redux'
import { useAccount } from 'wagmi'

const mapState = (state: RootState, ownProps: FunkitBuyOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const loading = selectDepositPending(state)
  const inputError = selectInputError(state)
  const depositError = selectDepositError(state)
  const fromChain = selectBridgeSourceChain(state)
  const fromAmount = selectBridgeFrom(state, bridgeKey)
  const fromTokenKey = selectFromTokenKeyForBridge(state, bridgeKey)
  const fromTokenInfo = tokensConfig[fromTokenKey]
  const disabled = !fromAmount.trim()
  const showFunkitBuy = !!inputError

  return {
    fromAmount,
    fromTokenInfo,
    fromChain,
    bridgeKey,
    loading,
    disabled,
    showFunkitBuy,
  }
}

const mapDispatch = {
  performDeposit,
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: FunkitBuyOwnProps
) => {
  return {
    ...stateProps,
    ...ownProps,
  }
}

const connector = connect(mapState, mapDispatch, mergeProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface FunkitBuyOwnProps {}

interface FunkitBuyProps extends FunkitBuyOwnProps, PropsFromRedux {}

export namespace FunkitBuyConnector {
  export const Connector = connector
  export type Props = FunkitBuyProps
}
