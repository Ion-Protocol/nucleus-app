import { bigIntToNumber } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex, Heading, Icon, Link, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { SquareArrowOutUpRight } from 'lucide-react'
import { Address } from 'viem'

interface RequestDetailsProps {
  amount: string
  offerToken: Address
  wantToken: Address
  atomicPrice: string
  deadline: string
  createdTimestamp: string
  createdAtTxHash: string
}

const RequestDetails = ({
  amount,
  offerToken,
  wantToken,
  atomicPrice,
  deadline,
  createdTimestamp,
  createdAtTxHash,
}: RequestDetailsProps) => {
  // Request Data

  const withdrawalAmount = bigIntToNumber(BigInt(amount), { decimals: 18 })
  const minimumPrice = bigIntToNumber(BigInt(atomicPrice), { decimals: 18 })
  const receiveAtLeast = withdrawalAmount * minimumPrice

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
            {`${withdrawalAmount} ${getSymbolByAddress(offerToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Minimum Price
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${minimumPrice} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Receive at least
          </Text>
          <Text fontSize="md" color="element.lighter">
            {`${receiveAtLeast} ${getSymbolByAddress(wantToken)}`}
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
          <Flex alignItems="center" gap={1}>
            <Text fontSize="md" color="element.lighter">
              {format(fromUnixTime(Number(createdTimestamp)), 'PPpp')}
            </Text>
            <Link
              isExternal
              href={`https://etherscan.io/tx/${createdAtTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              color="element.lighter"
            >
              <Icon as={SquareArrowOutUpRight} boxSize={4} color="element.lighter" />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default RequestDetails
