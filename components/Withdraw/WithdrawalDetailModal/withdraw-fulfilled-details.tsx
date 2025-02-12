import { IonTooltip } from '@/components/shared/IonTooltip'
import { bigIntToNumber } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { Flex, Heading, Icon, Link, Text } from '@chakra-ui/react'
import { LinkExternal02 } from '@untitled-ui/icons-react'
import { format, fromUnixTime } from 'date-fns'
import { Address } from 'viem'

const FulfilledDetails = ({
  filledAtTxHash,
  wantAmountRec,
  offerToken,
  offerAmountSpent,
  wantToken,
  endingTimestamp,
}: {
  filledAtTxHash: string | null
  wantAmountRec: string
  offerToken: Address
  offerAmountSpent: string
  wantToken: Address
  endingTimestamp: string
}) => {
  const displayThreshold = 0.0001
  const wantAmountRecAsNumber = bigIntToNumber(BigInt(wantAmountRec), { decimals: 18 })
  const wantAmountRecDisplayAmount =
    wantAmountRecAsNumber < displayThreshold ? '< 0.0001' : wantAmountRecAsNumber.toFixed(4)

  const offerAmountSpentAsNumber = bigIntToNumber(BigInt(offerAmountSpent), { decimals: 18 })
  const filledPrice = wantAmountRecAsNumber / offerAmountSpentAsNumber

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
          <IonTooltip label={filledPrice}>
            <Text fontSize="md" color="element.lighter">
              {`${filledPrice.toFixed(4)} ${getSymbolByAddress(wantToken)}/${getSymbolByAddress(offerToken)}`}
            </Text>
          </IonTooltip>
        </Flex>
        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Received
          </Text>
          <IonTooltip label={wantAmountRecAsNumber}>
            <Text fontSize="md" color="element.lighter">
              {`${wantAmountRecDisplayAmount} ${getSymbolByAddress(wantToken)}`}
            </Text>
          </IonTooltip>
        </Flex>

        <Flex justifyContent="space-between">
          <Text fontSize="md" color="element.subdued">
            Filled at
          </Text>
          <Flex alignItems="center" gap={1}>
            <Text fontSize="md" color="element.lighter">
              {format(fromUnixTime(Number(endingTimestamp)), 'PPpp')}
            </Text>
            {filledAtTxHash && (
              <Link
                isExternal
                href={`https://etherscan.io/tx/${filledAtTxHash}`}
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
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default FulfilledDetails
