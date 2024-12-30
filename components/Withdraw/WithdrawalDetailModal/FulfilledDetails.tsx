import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { Address } from 'viem'

const FulfilledDetails = ({
  filledPrice,
  wantAmountRecAsNumber,
  wantToken,
  endingTimestamp,
}: {
  filledPrice: number
  wantAmountRecAsNumber: number
  wantToken: Address
  endingTimestamp: string
}) => {
  return (
    <>
      <Heading as="h4" size="md">
        Fulfillment
      </Heading>
      <Flex direction="column" gap={2} border="1px solid" borderColor="gray.200" p={4} borderRadius="md">
        <Flex justifyContent="space-between">
          <Text>Filled Price</Text>
          <Text>{filledPrice}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Received</Text>
          <Text>{`${wantAmountRecAsNumber} ${getSymbolByAddress(wantToken)}`}</Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Text>Filled at</Text>
          <Text>{format(fromUnixTime(Number(endingTimestamp)), 'PPpp')}</Text>
        </Flex>
      </Flex>
    </>
  )
}

export default FulfilledDetails
