import { RootState } from '@/store'
import { selectPositionsLoading, selectPositionsTableData } from '@/store/slices/positions'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: MarketsTableOwnProps) => {
  const tableData = selectPositionsTableData(state)
  const loading = selectPositionsLoading(state)
  return { tableData, loading }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface MarketsTableOwnProps {}

interface MarketsTableProps extends MarketsTableOwnProps, PropsFromRedux, ChakraProps {}

export namespace MarketsTableConnector {
  export const Connector = connector
  export type Props = MarketsTableProps
}
