import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectInputError,
  selectSourceChainKey,
  selectWantTokens,
  selectWantTokenKey,
  setSelectedWantToken,
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
  const tokenKeys = selectWantTokens(state)
  const redeemAmountAsBigInt = selectRedeemAmountAsBigInt(state)

  const wantTokenKey = selectWantTokenKey(state) || tokenKeys[0] || null
  const wantToken = tokensConfig[wantTokenKey as keyof typeof tokensConfig]
  const accountantAddress = selectContractAddressByName(state, 'accountant')
  const wantAssetAddress = selectTokenAddressByTokenKey(state, wantTokenKey)
  const chainId = selectSourceChainId(state)

  const tokens = tokenKeys.map((key) => tokensConfig[key])

  const formattedTokenBalance = selectFormattedTokenBalance(state, selectedChainKey, wantTokenKey)

  return {
    wantToken,
    wantAssetAddress,
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
  onChangeToken: (token: TokenKey) => setSelectedWantToken({ tokenKey: token }),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemTokenDestinationOwnProps {}

interface RedeemTokenDestinationProps extends RedeemTokenDestinationOwnProps, PropsFromRedux {}

export namespace RedeemTokenDestinationConnector {
  export const Connector = connector
  export type Props = RedeemTokenDestinationProps
}
