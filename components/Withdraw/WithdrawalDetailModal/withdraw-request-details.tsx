import { bigIntToNumberAsString } from '@/utils/bigint'
import { formatWithSignificantDecimals } from '@/utils/number'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { Address } from 'viem'

interface RequestDetailsProps {
  amount: string
  offerToken: Address
  wantToken: Address
  minimumPrice: number
  receiveAtLeast: number
  deadline: string
  createdTimestamp: string
}

const RequestDetails = ({
  amount,
  offerToken,
  wantToken,
  minimumPrice,
  receiveAtLeast,
  deadline,
  createdTimestamp,
}: RequestDetailsProps) => {
  const formattedAmount = formatWithSignificantDecimals(
    bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 18 })
  )
  const formattedReceiveAtLeast = formatWithSignificantDecimals(receiveAtLeast)
  console.log('formattedReceiveAtLeast', formattedReceiveAtLeast)
  return (
    <Flex direction="column" gap={2}>
      <Heading as="h4" fontSize="lg" fontFamily="diatype" fontWeight="regular" color="element.main">
        Request
      </Heading>
      <Flex
        fontFamily="diatype"
        direction="column"
        gap={2}
        border="1px solid"
        borderColor="stroke.light"
        p={3}
        borderRadius="md"
      >
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            To Redeem
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 8 })} ${getSymbolByAddress(offerToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Minimum Price
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${minimumPrice.toFixed(4)} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Receive at least
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${formatWithSignificantDecimals(receiveAtLeast)} ${getSymbolByAddress(wantToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Deadline
          </Text>
          <Text fontSize="md" color="element.lighter">
            {format(fromUnixTime(Number(deadline)), 'PPpp')}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Created at
          </Text>
          <Text fontSize="md" color="element.lighter">
            {format(fromUnixTime(Number(createdTimestamp)), 'PPpp')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default RequestDetails
