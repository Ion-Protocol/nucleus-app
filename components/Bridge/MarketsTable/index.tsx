import { Flex, Table, TableContainer, Tbody, Thead, Tr } from '@chakra-ui/react'
import { IonTd } from './IonTd'
import { IonTh } from './IonTh'
import { Loading } from './Loading'
import { NoData } from './NoData'
import { MarketsTableConnector } from './connector'

function MarketsTable({ tableData, loading }: MarketsTableConnector.Props) {
  const noData = tableData.length === 0

  return (
    <Flex direction="column">
      <TableContainer width="full">
        <Table variant="simple">
          <Thead bg="table.background" borderTop="1px solid" borderTopColor="borderSubtle" h="60px">
            <Tr>
              <IonTh tooltip="The market of the position">Market</IonTh>
              <IonTh tooltip="The total supplied asset on the market">Total Supplied</IonTh>
              <IonTh tooltip="The overall annual percentage yield of the supplied asset on the market">APY</IonTh>
              <IonTh tooltip="The utilization rate of the supplied asset">Utilization Rate</IonTh>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Loading />
            ) : noData ? (
              <NoData />
            ) : (
              tableData.map((p) => (
                <Tr
                  key={p.marketId}
                  borderTop="1px solid"
                  borderTopColor="red"
                  sx={{
                    '&:hover': {
                      bg: 'hover',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <IonTd>{p.formattedMarket}</IonTd>
                  <IonTd textAlign="right">{p.formattedTotalSupplied}</IonTd>
                  <IonTd textAlign="right">{p.formattedApy}</IonTd>
                  <IonTd textAlign="right">{p.formattedUtilizationRate}</IonTd>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default MarketsTableConnector.Connector(MarketsTable)
