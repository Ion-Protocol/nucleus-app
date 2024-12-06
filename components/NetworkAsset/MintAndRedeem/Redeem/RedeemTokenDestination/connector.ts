import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectInputError,
  selectSourceChainKey,
  selectReceiveTokens,
  selectReceiveTokenKey,
  setSelectedReceiveToken,
  selectContractAddressByName,
  selectTokenAddressByTokenKey,
  selectSourceChainId,
  selectRedeemAmountAsBigInt,
} from '@/store/slices/networkAssets'

import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RedeemTokenDestinationOwnProps) => {
  const currentPageChainKey = selectNetworkAssetFromRoute(state)
  const selectedChainKey = selectSourceChainKey(state)
  const tokenKeys = selectReceiveTokens(state)
  const redeemAmountAsBigInt = selectRedeemAmountAsBigInt(state)

  const receiveTokenKey = selectReceiveTokenKey(state) || tokenKeys[0] || null
  const receiveToken = tokensConfig[receiveTokenKey as keyof typeof tokensConfig]
  const accountantAddress = selectContractAddressByName(state, 'accountant')
  const receiveAssetAddress = selectTokenAddressByTokenKey(state, receiveTokenKey)
  const chainId = selectSourceChainId(state)

  const tokens = tokenKeys.map((key) => tokensConfig[key])

  const formattedTokenBalance = selectFormattedTokenBalance(state, selectedChainKey, receiveTokenKey)

  return {
    receiveToken,
    receiveAssetAddress,
    chainId,
    accountantAddress,
    tokenBalance: formattedTokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
    error: selectInputError(state),
    tokens,
    currentPageChainKey,
    shouldIgnoreBalance: false,
    redeemAmountAsBigInt,
  }
}

const mapDispatch = {
  onChangeToken: (token: TokenKey) => setSelectedReceiveToken({ tokenKey: token }),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemTokenDestinationOwnProps {}

interface RedeemTokenDestinationProps extends RedeemTokenDestinationOwnProps, PropsFromRedux {}

export namespace RedeemTokenDestinationConnector {
  export const Connector = connector
  export type Props = RedeemTokenDestinationProps
}
