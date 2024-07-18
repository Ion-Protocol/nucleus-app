import { RootState } from '@/store'
import { selectPositionsLoadingWithDependencies, selectPositionsTableData } from '@/store/slices/positions'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: MarketsTableOwnProps) => {
  let tableData = selectPositionsTableData(state)
  const loading = selectPositionsLoadingWithDependencies(state)

  if (!tableData) {
    tableData = []
  } else {
    tableData = tableData.filter((item) => item !== null)
  }

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
