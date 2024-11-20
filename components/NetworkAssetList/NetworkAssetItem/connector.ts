import { chainsConfig } from '@/config/chains'
import { RootState } from '@/store'
import {
  selectFormattedNetApy,
  selectFormattedNetworkAssetTvlByKey,
  selectNetApy,
  selectNetApyLoading,
  selectNetworkAssetConfigByKey,
  selectShouldShowMessageForLargeNetApy,
  selectTvlLoading,
  selectContractAddressByName,
} from '@/store/slices/networkAssets'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: YieldBridgeItemOwnProps) => {
  const { networkAssetKey } = ownProps
  const networkAssetConfig = selectNetworkAssetConfigByKey(state, networkAssetKey)
  const disabled = networkAssetConfig?.comingSoon
  const tvlLoading = selectTvlLoading(state)
  const tvl = selectFormattedNetworkAssetTvlByKey(state, networkAssetKey)
  const networkAssetName = networkAssetConfig?.token.name
  const boringVaultAddress = networkAssetConfig?.contracts.boringVault
  const chainName = networkAssetConfig ? chainsConfig[networkAssetConfig.chain].name : ''
  const comingSoon = networkAssetConfig?.comingSoon || null
  const formattedNetApy = selectFormattedNetApy(state, networkAssetKey)
  const rawNetApy = selectNetApy(state, networkAssetKey)
  const fullFormattedNetApy = `${numberToPercent(rawNetApy || 0)}%`

  const netApyLoading = selectNetApyLoading(state)
  const shouldShowMessageForLargeNetApy = selectShouldShowMessageForLargeNetApy(state, networkAssetKey)

  return {
    tvl,
    boringVaultAddress,
    networkAssetName,
    networkAssetKey,
    chainName,
    comingSoon,
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
  networkAssetKey: TokenKey
}

interface YieldBridgeItemProps extends PropsFromRedux, YieldBridgeItemOwnProps {}

export namespace YieldBridgeItemConnector {
  export const Connector = connector
  export type Props = YieldBridgeItemProps
}
