import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { Address } from 'viem'

const FulfilledDetails = ({
  filledPrice,
  wantAmountRecAsNumber,
  offerToken,
  wantToken,
  endingTimestamp,
}: {
  filledPrice: number
  wantAmountRecAsNumber: number
  offerToken: Address
  wantToken: Address
  endingTimestamp: string
}) => {
  return (
    <Flex direction="column" gap={2}>
      <Heading as="h4" fontSize="lg" fontFamily="diatype" fontWeight="regular" color="element.main">
        Fulfillment
      </Heading>
      <Flex direction="column" gap={2} border="1px solid" borderColor="stroke.light" p={4} borderRadius="md">
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Filled Price
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${filledPrice.toFixed(3)} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Received
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${wantAmountRecAsNumber.toFixed(2)} ${getSymbolByAddress(wantToken)}`}
          </Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Filled at
          </Text>
          <Text fontSize="md" color="element.lighter">
            {format(fromUnixTime(Number(endingTimestamp)), 'PPpp')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default FulfilledDetails
