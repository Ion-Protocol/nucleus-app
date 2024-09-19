import { etherscanBaseUrl, hardcodedApy } from '@/config/constants'
import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import {
  selectFormattedNetApy,
  selectNetApy,
  selectNetworkAssetApy,
  selectNetworkAssetConfigByKey,
  selectPointsSystemForNetworkAsset,
  selectShouldShowMessageForLargeNetApy,
} from '@/store/slices/networkAssets'
import { ChainKey } from '@/types/ChainKey'
import { PointSystem } from '@/types/PointSystem'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

interface MapStateToPropsType {
  defaultYieldAssetKey: TokenKey | null
  defaultYieldAssetName: string
  defaultYieldAssetPercent: string
  tokenIncentives: {
    tokenKey: TokenKey
    name: string
    formattedApy: string | null
    etherscanUrl: string | null
  }[]
  rewards: PointSystem[]
  netApy: string
  fullFormattedNetApy: string
  shouldShowMessageForLargeNetApy: boolean
}

const mapState = (state: RootState, ownProps: RewardsTooltipContentOwnProps): MapStateToPropsType => {
  const { tokenKey: networkAssetKey } = ownProps
  const networkAssetConfig = networkAssetKey ? selectNetworkAssetConfigByKey(state, networkAssetKey) : null
  if (!networkAssetKey || !networkAssetConfig) {
    return {
      defaultYieldAssetKey: null,
      defaultYieldAssetName: '',
      defaultYieldAssetPercent: '',
      tokenIncentives: [],
      rewards: [],
      netApy: '',
      fullFormattedNetApy: '',
      shouldShowMessageForLargeNetApy: false,
    }
  }
  const defaultYieldAssetName = tokensConfig[networkAssetKey as TokenKey].name
  const defaultYieldAssetPercent = `${hardcodedApy.toFixed(1)}%`

  const tokenIncentives: {
    tokenKey: TokenKey
    name: string
    formattedApy: string | null
    etherscanUrl: string | null
  }[] = Object.keys(networkAssetConfig.apys).map((apyTokenKey) => {
    const apy = selectNetworkAssetApy(state, networkAssetKey, apyTokenKey as TokenKey) || 0
    const tokenAddress = tokensConfig[apyTokenKey as TokenKey].addresses[ChainKey.ETHEREUM]
    return {
      tokenKey: apyTokenKey as TokenKey,
      name: tokensConfig[apyTokenKey as TokenKey].symbol,
      etherscanUrl: tokenAddress !== '0x' ? `${etherscanBaseUrl}${tokenAddress}` : null,
      formattedApy: `${apy?.toFixed(1)}%`,
    }
  })

  const rewards = selectPointsSystemForNetworkAsset(state, networkAssetKey)

  const rawNetApy = selectNetApy(state, networkAssetKey)
  const fullFormattedNetApy = `${numberToPercent(rawNetApy || 0)}`
  const netApy = selectFormattedNetApy(state, networkAssetKey)
  const shouldShowMessageForLargeNetApy = selectShouldShowMessageForLargeNetApy(state, networkAssetKey)

  return {
    defaultYieldAssetKey: networkAssetKey,
    defaultYieldAssetName,
    defaultYieldAssetPercent,
    tokenIncentives,
    rewards,
    netApy,
    fullFormattedNetApy,
    shouldShowMessageForLargeNetApy,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsTooltipContentOwnProps {
  tokenKey: TokenKey | null
}

interface RewardsTooltipContentProps extends RewardsTooltipContentOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsTooltipContentConnector {
  export const Connector = connector
  export type Props = RewardsTooltipContentProps
}
