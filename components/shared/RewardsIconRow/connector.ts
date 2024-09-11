import { RootState } from '@/store'
import { selectIncentiveChainKeysForBridge, selectRewardsAndPointsRows } from '@/store/slices/bridges'
import { ChainKey } from '@/types/ChainKey'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsIconRowOwnProps) => {
  const { chainKey } = ownProps

  if (chainKey === null) {
    return {
      rewardsAndPointsRows: [],
      incentiveChainKeys: [],
    }
  }

  const rewardsAndPointsRows = selectRewardsAndPointsRows(chainKey)(state)
  const incentiveChainKeys = selectIncentiveChainKeysForBridge(chainKey)(state)

  return {
    rewardsAndPointsRows,
    incentiveChainKeys,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsIconRowOwnProps {
  chainKey: ChainKey | null
}

interface RewardsIconRowProps extends RewardsIconRowOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsIconRowConnector {
  export const Connector = connector
  export type Props = RewardsIconRowProps
}
