import { etherscanBaseUrl, hardcodedApy } from '@/config/constants'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import {
  selectFormattedNetApy,
  selectNetworkConfig,
  selectPointsSystemsForBridge,
  selectTokenApy,
  selectYieldAssetByChainKey,
  selectYieldAssetNameByChainKey,
} from '@/store/slices/bridges'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsTooltipContentOwnProps) => {
  const { chainKey } = ownProps
  const networkConfig = selectNetworkConfig(state)
  const chainConfig = chainKey ? networkConfig?.chains[chainKey] : null
  if (!chainKey || !chainConfig) {
    return {
      defaultYieldAssetKey: null,
      defaultYieldAssetName: '',
      defaultYieldAssetPercent: '',
      tokenIncentives: [],
      rewards: [],
      netApy: '',
    }
  }
  const defaultYieldAssetKey = selectYieldAssetByChainKey(chainKey)(state)
  const defaultYieldAssetName = selectYieldAssetNameByChainKey(chainKey)(state)
  const defaultYieldAssetPercent = `${hardcodedApy.toFixed(1)}%`

  const tokenIncentives: {
    tokenKey: TokenKey
    name: string
    formattedApy: string | null
    etherscanUrl: string | null
  }[] = Object.keys(chainConfig?.tokenApyData).map((tokenKey) => {
    const apy = selectTokenApy(tokenKey as TokenKey, chainKey)(state)|| 0
    const apyPerc = apy * 100
    const tokenAddress = tokensConfig[tokenKey as TokenKey].chains[ChainKey.ETHEREUM]?.address
    return {
      tokenKey: tokenKey as TokenKey,
      name: tokensConfig[tokenKey as TokenKey].symbol,
      etherscanUrl: tokenAddress !== '0x' ? `${etherscanBaseUrl}${tokenAddress}` : null,
      formattedApy: `${apyPerc?.toFixed(1)}%`,
    }
  })

  const rewards = selectPointsSystemsForBridge(chainKey)(state)

  const netApy = selectFormattedNetApy(chainKey)(state)

  return {
    defaultYieldAssetKey,
    defaultYieldAssetName,
    defaultYieldAssetPercent,
    tokenIncentives,
    rewards,
    netApy,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsTooltipContentOwnProps {
  chainKey: ChainKey | null
}

interface RewardsTooltipContentProps extends RewardsTooltipContentOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsTooltipContentConnector {
  export const Connector = connector
  export type Props = RewardsTooltipContentProps
}
