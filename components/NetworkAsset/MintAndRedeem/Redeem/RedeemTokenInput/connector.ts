import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { useGetPreviewFeeQuery } from '@/store/api/Teller/previewFeeApi'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectDepositAmount,
  selectInputError,
  selectShouldIgnoreBalance,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectSourceTokens,
  selectTokenRateInQuote,
  selectRedeemAmount,
  setDepositAmount,
  setSelectedSourceToken,
  setRedeemAmount,
  selectWantTokens,
  selectWantTokenKey,
  setSelectedWantToken,
  selectContractAddressByName,
  selectTokenAddressByTokenKey,
  selectSourceChainId,
  selectRedeemAmountAsBigInt,
} from '@/store/slices/networkAssets'
import { setWithdrawalAmountMax } from '@/store/slices/networkAssets/thunks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RedeemTokenInputOwnProps) => {
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
  onMax: () => setWithdrawalAmountMax(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemTokenInputOwnProps {}

interface RedeemTokenInputProps extends RedeemTokenInputOwnProps, PropsFromRedux {}

export namespace RedeemTokenInputConnector {
  export const Connector = connector
  export type Props = RedeemTokenInputProps
}
