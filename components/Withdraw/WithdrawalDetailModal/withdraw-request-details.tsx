import { IonTooltip } from '@/components/shared/IonTooltip'
import { bigIntToNumber, bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex, Heading, Icon, Link, Text } from '@chakra-ui/react'
import { LinkExternal02 } from '@untitled-ui/icons-react'
import { format, fromUnixTime } from 'date-fns'
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
  const displayThreshold = 0.0001
  const fullAmount = bigIntToNumber(BigInt(amount), { decimals: 18 })
  const displayAmount =
    fullAmount < displayThreshold
      ? '< 0.0001'
      : bigIntToNumberAsString(BigInt(amount), {
          decimals: 18,
          maximumFractionDigits: 4,
        })

  const withdrawalAmount = bigIntToNumber(BigInt(amount), { decimals: 18 })
  const minimumPrice = bigIntToNumber(BigInt(atomicPrice), { decimals: 18 })
  const receiveAtLeast = withdrawalAmount * minimumPrice
  const receiveAtLeastDisplayAmount = receiveAtLeast < displayThreshold ? '< 0.0001' : receiveAtLeast.toFixed(4)

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
          <IonTooltip label={fullAmount}>
            <Text fontSize="md" color="element.lighter">
              {`${displayAmount} ${getSymbolByAddress(offerToken)}`}
            </Text>
          </IonTooltip>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Minimum Price
          </Text>
          <IonTooltip label={minimumPrice}>
            <Text fontSize="md" color="element.lighter">
              {`${minimumPrice.toFixed(4)} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}
            </Text>
          </IonTooltip>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Receive at least
          </Text>
          <IonTooltip label={receiveAtLeast}>
            <Text fontSize="md" color="element.lighter">
              {`${receiveAtLeastDisplayAmount} ${getSymbolByAddress(wantToken)}`}
            </Text>
          </IonTooltip>
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
            {/* TODO: update with lookup function to get explorer base url */}
            <Link
              isExternal
              href={`https://etherscan.io/tx/${createdAtTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              color="element.lighter"
            >
              <Icon
                as={LinkExternal02}
                boxSize={4}
                color="element.lighter"
                sx={{
                  path: {
                    strokeWidth: '1px',
                  },
                }}
              />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default RequestDetails
