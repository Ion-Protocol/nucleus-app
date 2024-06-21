import { Flex, Skeleton, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react'
import { IonTh } from './IonTh'
import { MarketsTableConnector } from './connector'
import { IonTd } from './IonTd'

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
              Array.from({ length: 4 }).map((_, index) => (
                <Tr key={index}>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                  <Td>
                    <Skeleton height="20px" />
                  </Td>
                </Tr>
              ))
            ) : noData ? (
              <Tr>
                <Td colSpan={4} border="none">
                  <Text variant="xl" color="secondaryText" textAlign="center" mt={10}>
                    No positions found
                  </Text>
                </Td>
              </Tr>
            ) : (
              tableData.map((p) => (
                <Tr key={p.marketId} borderTop="1px solid" borderTopColor="red">
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
