import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import { TokenToConnector } from './connector'
import { IonSkeleton } from '@/components/shared/IonSkeleton'

function TokenDestination({
  value,
  chainToken,
  tokenBalance,
  loadingTokenBalance,
  loadingTokenRate,
}: TokenToConnector.Props) {
  return (
    <IonCard variant="outline" bg="formBackground" border="1px solid" borderColor="borderLight">
      {/* Top Row */}
      <Flex justify="space-between">
        <Text>Amount</Text>
        <Flex color="secondaryText" gap={1}>
          <Text variant="smallParagraph">Balance: </Text>
          <IonSkeleton isLoaded={!loadingTokenBalance} minW="25px">
            <Text variant="smallParagraph">{tokenBalance}</Text>
          </IonSkeleton>
        </Flex>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3} mt={3}>
        {/* Input Box */}
        <Flex w="full">
          <IonSkeleton isLoaded={!loadingTokenRate} minW="250px" w="50%">
            <Input
              disabled
              _disabled={{
                cursor: 'text',
                color: 'disabled',
              }}
              color="textSecondary"
              cursor="pointer"
              value={value}
              variant="unstyled"
              size="lg"
              placeholder="Amount"
              fontFamily="var(--font-ppformula)"
              fontSize="18px"
              letterSpacing="0.05em"
            />
          </IonSkeleton>
        </Flex>

        <Flex gap={2} align="center">
          <TokenIcon fontSize="28px" tokenKey={chainToken?.key || null} />
          <Text variant="paragraph">{chainToken?.name}</Text>
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenToConnector.Connector(TokenDestination)
