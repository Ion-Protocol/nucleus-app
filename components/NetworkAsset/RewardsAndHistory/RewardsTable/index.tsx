import { Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Flex } from '@chakra-ui/react'
import { RewardsTableConnector } from './connector'
import { TokenIcon } from '@/components/config/tokenIcons'

function RewardsTable({ tableData }: RewardsTableConnector.Props) {
  return (
    <TableContainer w="full" p={0} m={0}>
      <Table p={0} m={0}>
        <Thead bg="backgroundAlternate">
          <Tr>
            <Th textTransform="none" pl={3} py={5} borderColor="border">
              <Text variant="paragraphBold" color="tooltipLabel">
                Rewards
              </Text>
            </Th>
            <Th textTransform="none" pl={3} borderColor="border">
              <Text variant="paragraphBold" color="tooltipLabel">
                Total Claimed
              </Text>
            </Th>
            <Th textTransform="none" pl={3} borderColor="border">
              <Text variant="paragraphBold" color="tooltipLabel">
                Claimable
              </Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((tr) => (
            <Tr key={tr.tokenKey}>
              <Td borderBottom="1px solid" borderColor="border" py={3} pl={3}>
                <Flex align="center" gap={3}>
                  <TokenIcon tokenKey={tr.tokenKey} fontSize="30px" />
                  <Text variant="paragraph">${tr.tokenSymbol}</Text>
                </Flex>
              </Td>
              <Td borderBottom="1px solid" borderColor="border">
                <Text variant="paragraph">{tr.claimedTokenAmount}</Text>
              </Td>
              <Td borderBottom="1px solid" borderColor="border">
                <Flex
                  w="fit-content"
                  sx={{
                    background:
                      'linear-gradient(113.03deg, #FFF3C7 14.91%, #FFF6DB 40.18%, #FFF9E6 40.88%, #FFF9E6 55.61%, #FFF1BD 57.72%, #FFE78F 85.09%)',
                  }}
                  border="1px solid"
                  borderColor="claimButtonBorder"
                  borderRadius="4px"
                  px={2}
                  py={1}
                >
                  <Text variant="paragraph" color="claimButtonText">
                    {tr.claimableTokenAmount}
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RewardsTableConnector.Connector(RewardsTable)
