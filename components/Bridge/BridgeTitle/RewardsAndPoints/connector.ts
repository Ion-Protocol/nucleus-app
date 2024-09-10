import { RootState } from '@/store'
import { selectIncentiveChainKeysForBridge, selectRewardsAndPointsRows } from '@/store/slices/bridges'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsAndPointsOwnProps) => {
  const chainKeyFromRoute = selectChainKeyFromRoute(state)
  if (!chainKeyFromRoute) {
    return {
      rewardsAndPointsRows: [],
      incentiveChainKeys: [],
    }
  }
  const rewardsAndPointsRows = selectRewardsAndPointsRows(chainKeyFromRoute)(state)
  const incentiveChainKeys = selectIncentiveChainKeysForBridge(chainKeyFromRoute)(state)

  return {
    rewardsAndPointsRows,
    incentiveChainKeys,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsAndPointsOwnProps {}

interface RewardsAndPointsProps extends RewardsAndPointsOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsAndPointsConnector {
  export const Connector = connector
  export type Props = RewardsAndPointsProps
}
