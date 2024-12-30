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
  deadline: string
  createdTimestamp: string
}

const RequestDetails = ({
  amount,
  offerToken,
  wantToken,
  minimumPrice,
  deadline,
  createdTimestamp,
}: RequestDetailsProps) => {
  return (
    <>
      <Heading as="h4" size="md">
        Request
      </Heading>
      <Flex direction="column" gap={2} border="1px solid" borderColor="gray.200" p={4} borderRadius="md">
        <Flex justifyContent="space-between">
          <Text>To Redeem</Text>
          <Text>
            {bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 8 })}{' '}
            {getSymbolByAddress(offerToken)}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Minimum Price</Text>
          <Text>{`${minimumPrice} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Receive at least</Text>
          <Text>
            {`
                ${bigIntToNumberAsString(BigInt(amount), { minimumFractionDigits: 0, maximumFractionDigits: 8 })} 
                ${getSymbolByAddress(wantToken)}
                `}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Deadline</Text>
          <Text>{format(fromUnixTime(Number(deadline)), 'PPpp')}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Created at</Text>
          <Text>{format(fromUnixTime(Number(createdTimestamp)), 'PPpp')}</Text>
        </Flex>
      </Flex>
    </>
  )
}

export default RequestDetails
