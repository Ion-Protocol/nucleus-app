import { RootState } from '@/store'
import { selectRewardsTableData } from '@/store/slices/networkAssets'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RewardsTableOwnProps) => {
  const tableData = selectRewardsTableData(state)
  return { tableData }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RewardsTableOwnProps {}

interface RewardsTableProps extends RewardsTableOwnProps, PropsFromRedux, ChakraProps {}

export namespace RewardsTableConnector {
  export const Connector = connector
  export type Props = RewardsTableProps
}
