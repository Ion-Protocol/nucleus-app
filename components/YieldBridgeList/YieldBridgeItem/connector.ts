import { BridgeKey } from '@/config/chains'
import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import {
  selectBridgeConfigByKey,
  selectFormattedBridgeTvlByKey,
  selectFromattedBridgeApyKey,
  selectTvlLoading,
} from '@/store/slices/bridges'
import { selectNetApyLoading } from '@/store/slices/netApy'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: YieldBridgeItemOwnProps) => {
  const { bridgeKey } = ownProps
  const bridgeConfig = selectBridgeConfigByKey(bridgeKey)(state)
  const disabled = bridgeConfig?.comingSoon
  const loading = selectTvlLoading(state) || selectNetApyLoading(state)
  const tvl = selectFormattedBridgeTvlByKey(bridgeKey)(state)
  const apy = selectFromattedBridgeApyKey(bridgeKey)(state)
  const name = bridgeConfig?.name || ''
  const comingSoon = bridgeConfig?.comingSoon || false

  const maxDescriptionLength = uiConfig.pages.dashboard.yieldBridges.descriptionLength
  let description = bridgeConfig?.description || ''
  if (description && description.length > maxDescriptionLength) {
    description = `${description.slice(0, maxDescriptionLength)}...`
  }

  return {
    tvl,
    apy,
    name,
    comingSoon,
    bridgeKey,
    description,
    disabled,
    loading,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface YieldBridgeItemOwnProps {
  bridgeKey: BridgeKey
}

interface YieldBridgeItemProps extends PropsFromRedux, YieldBridgeItemOwnProps {}

export namespace YieldBridgeItemConnector {
  export const Connector = connector
  export type Props = YieldBridgeItemProps
}
