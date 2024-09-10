import { RootState } from '@/store'
import { selectIncentiveChainKeys, selectRewardsAndPointsRows } from '@/store/slices/bridges'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsAndPointsOwnProps) => {
  const rewardsAndPointsRows = selectRewardsAndPointsRows(state)
  const incentiveChainKeys = selectIncentiveChainKeys(state)

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
