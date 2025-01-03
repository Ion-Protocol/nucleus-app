import { bigIntToNumberAsString } from '@/utils/bigint'
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
  return (
    <Flex direction="column" gap={2}>
      <Heading as="h4" fontSize="lg" fontFamily="diatype" fontWeight="regular">
        Request
      </Heading>
      <Flex
        fontFamily="diatype"
        direction="column"
        gap={2}
        border="1px solid"
        borderColor="gray.200"
        p={3}
        borderRadius="md"
      >
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="neutral.800">
            To Redeem
          </Text>
          <Text fontSize="md">
            {`${bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 8 })} ${getSymbolByAddress(offerToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="neutral.800">
            Minimum Price
          </Text>
          <Text fontSize="md">{`${minimumPrice.toFixed(4)} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="neutral.800">
            Receive at least
          </Text>
          <Text fontSize="md">
            {`
                ${receiveAtLeast.toFixed(2)} 
                ${getSymbolByAddress(wantToken)}
                `}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="neutral.800">
            Deadline
          </Text>
          <Text fontSize="md">{format(fromUnixTime(Number(deadline)), 'PPpp')}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="neutral.800">
            Created at
          </Text>
          <Text fontSize="md">{format(fromUnixTime(Number(createdTimestamp)), 'PPpp')}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default RequestDetails
