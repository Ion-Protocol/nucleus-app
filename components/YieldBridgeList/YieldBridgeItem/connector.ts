import { RootState } from '@/store'
import {
  selectChainConfigByKey,
  selectFormattedChainTvlByKey,
  selectFormattedNetApy,
  selectNetApyLoading,
  selectTvlLoading,
  selectYieldAssetNameByChainKey,
} from '@/store/slices/bridges'
import { ChainKey } from '@/types/ChainKey'
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
  const netApy = selectFormattedNetApy(chainKey)(state)
  const netApyLoading = selectNetApyLoading(state)

  return {
    tvl,
    yieldAssetName,
    yieldAssetKey,
    chainName,
    comingSoon,
    chainKey,
    disabled,
    tvlLoading,
    netApy,
    netApyLoading,
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
