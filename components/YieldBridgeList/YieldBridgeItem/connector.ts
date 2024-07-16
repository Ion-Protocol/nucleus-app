import { BridgeKey } from '@/config/chains'
import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import {
  selectBridgeConfigByKey,
  selectBridgeLoadingByKey,
  selectFormattedBridgeTvlByKey,
  selectFromattedBridgeApyKey,
} from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: YieldBridgeItemOwnProps) => {
  const { bridgeKey } = ownProps
  const bridgeConfig = selectBridgeConfigByKey(bridgeKey)(state)
  const disabled = bridgeConfig.comingSoon
  const loading = selectBridgeLoadingByKey(state)
  const tvl = selectFormattedBridgeTvlByKey(bridgeKey)(state)
  const apy = selectFromattedBridgeApyKey(bridgeKey)(state)

  const maxDescriptionLength = uiConfig.pages.dashboard.yieldBridges.descriptionLength
  let description = bridgeConfig.description
  if (description && description.length > maxDescriptionLength) {
    description = `${description.slice(0, maxDescriptionLength)}...`
  }

  return {
    bridgeConfig,
    tvl,
    apy,
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
