import { TokenIcon } from '@/components/config/tokenIcons'
import { DoubleIcon } from '@/components/shared/DoubleIcon'
import { OpenNewTabIcon } from '@/components/shared/icons/OpenNewTab'
import { Flex, Table, TableContainer, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react'
import { IonTd } from './IonTd'
import { IonTh } from './IonTh'
import { Loading } from './Loading'
import { NoData } from './NoData'
import { MarketsTableConnector } from './connector'

function MarketsTable({ tableData, loading }: MarketsTableConnector.Props) {
  const noData = !tableData || tableData?.length === 0

  function handleClickRow(index: number) {
    const url = tableData?.[index]?.marketUrl
    if (!url) {
      throw new Error('Market URL not found')
    }
    window.open(url, '_blank')
  }

  return (
    <Flex direction="column">
      <TableContainer width="full">
        <Table variant="simple">
          <Thead bg="table.background" borderTop="1px solid" borderTopColor="borderSubtle" h="60px">
            <Tr>
              <IonTh tooltip="All markets that the native yield token earns from.">Market</IonTh>
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
              tableData.map(
                (pos, i) =>
                  pos && (
                    <Tr
                      key={pos.marketId}
                      borderTop="1px solid"
                      borderTopColor="red"
                      sx={{
                        '&:hover': {
                          bg: 'hover',
                          cursor: 'pointer',
                        },
                      }}
                      h="60px"
                      onClick={() => handleClickRow(i)}
                    >
                      <Td borderColor="border">
                        <Flex align="center" gap={2}>
                          <DoubleIcon
                            icons={[
                              <TokenIcon fontSize="20px" tokenKey={pos.lenderAsset} key={0} />,
                              <TokenIcon fontSize="20px" tokenKey={pos.collateralAsset} key={1} />,
                            ]}
                          />
                          <Text variant="large" fontWeight="bold">
                            {pos.formattedMarket}
                          </Text>
                          <OpenNewTabIcon fontSize="10px" />
                        </Flex>
                      </Td>
                      <IonTd textAlign="right">{pos.formattedTotalSupplied}</IonTd>
                      <IonTd textAlign="right">{pos.formattedApy}</IonTd>
                      <IonTd textAlign="right">{pos.formattedUtilizationRate}</IonTd>
                    </Tr>
                  )
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default MarketsTableConnector.Connector(MarketsTable)
