import { RootState } from '@/store'
import {
  selectChainConfigByKey,
  selectFormattedChainTvlByKey,
  selectFormattedNetApy,
  selectNetApy,
  selectNetApyLoading,
  selectShouldShowMessageForLargeNetApy,
  selectTvlLoading,
  selectYieldAssetNameByChainKey,
} from '@/store/slices/bridges'
import { ChainKey } from '@/types/ChainKey'
import { numberToPercent } from '@/utils/number'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: YieldBridgeItemOwnProps) => {
  const { chainKey } = ownProps
  const chainConfig = selectChainConfigByKey(chainKey)(state)
  const disabled = chainConfig?.comingSoon
  const tvlLoading = selectTvlLoading(state)
  const tvl = selectFormattedChainTvlByKey(chainKey)(state)
  const chainName = chainConfig?.name || ''
  const yieldAssetName = selectYieldAssetNameByChainKey(chainKey)(state)
  const comingSoon = chainConfig?.comingSoon || false
  const yieldAssetKey = chainConfig?.yieldAsset || null
  const formattedNetApy = selectFormattedNetApy(chainKey)(state)
  const rawNetApy = selectNetApy(chainKey)(state)
  const fullFormattedNetApy = `${numberToPercent(rawNetApy || 0)}%`

  const netApyLoading = selectNetApyLoading(state)
  const shouldShowMessageForLargeNetApy = selectShouldShowMessageForLargeNetApy(chainKey)(state)

  return {
    tvl,
    yieldAssetName,
    yieldAssetKey,
    chainName,
    comingSoon,
    chainKey,
    disabled,
    tvlLoading,
    formattedNetApy,
    fullFormattedNetApy,
    netApyLoading,
    shouldShowMessageForLargeNetApy,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface YieldBridgeItemOwnProps {
  chainKey: ChainKey
}

interface YieldBridgeItemProps extends PropsFromRedux, YieldBridgeItemOwnProps {}

export namespace YieldBridgeItemConnector {
  export const Connector = connector
  export type Props = YieldBridgeItemProps
}
