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
  selectWithdrawAmount,
  setDepositAmount,
  setSelectedSourceToken,
  setWithdrawAmount,
  selectWantTokens,
  selectWantTokenKey,
  setSelectedWantToken,
  selectContractAddressByName,
  selectTokenAddressByTokenKey,
  selectSourceChainId,
} from '@/store/slices/networkAssets'
import { setDepositAmountMax, setWithdrawalAmountMax } from '@/store/slices/networkAssets/thunks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumberAsString, WAD } from '@/utils/bigint'
import { convertToDecimals } from '@/utils/number'
import { ConnectedProps, connect } from 'react-redux'
import { formatUnits } from 'viem'

const mapState = (state: RootState, ownProps: RedeemTokenInputOwnProps) => {
  const currentPageChainKey = selectNetworkAssetFromRoute(state)
  const selectedChainKey = selectSourceChainKey(state)
  const tokenKeys = selectWantTokens(state)

  const rate = selectTokenRateInQuote(state)
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)

  const withdrawAmount = selectWithdrawAmount(state)
  const withdrawAmountAsBigInt = BigInt(convertToDecimals(withdrawAmount, 18))
  const destinationAmountAsBigInt =
    rateAsBigInt > 0 ? (withdrawAmountAsBigInt * rateAsBigInt) / WAD.bigint : withdrawAmountAsBigInt

  const numberValue = parseFloat(formatUnits(destinationAmountAsBigInt, 18))
  const destinationAmountFormatted = bigIntToNumberAsString(destinationAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: numberValue < 1 ? 18 : 8,
  })

  const tokens = tokenKeys.map((key) => tokensConfig[key])

  const selectedTokenKey = selectWantTokenKey(state) || tokenKeys[0] || null
  const selectedToken = tokensConfig[selectedTokenKey as keyof typeof tokensConfig]

  const formattedTokenBalance = selectFormattedTokenBalance(state, selectedChainKey, selectedTokenKey)

  return {
    inputValue: destinationAmountFormatted,
    tokenBalance: formattedTokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
    error: selectInputError(state),
    tokens,
    selectedToken,
    currentPageChainKey,
    shouldIgnoreBalance: false,
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
