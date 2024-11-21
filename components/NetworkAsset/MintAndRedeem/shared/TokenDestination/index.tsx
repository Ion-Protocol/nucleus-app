import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import { TokenToConnector } from './connector'
import { IonSkeleton } from '@/components/shared/IonSkeleton'

function TokenDestination({
  value,
  networkAssetKey,
  networkAssetName,
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
          <IonSkeleton isLoaded={!loadingTokenRate} minW="250px" w="60%">
            <Input
              color="textSecondary"
              cursor="pointer"
              disabled
              _disabled={{
                cursor: 'text',
                color: 'disabled',
              }}
              fontFamily="var(--font-ppformula)"
              fontSize="18px"
              letterSpacing="0.05em"
              placeholder="Amount"
              size="lg"
              value={value}
              variant="unstyled"
            />
          </IonSkeleton>
        </Flex>

        <Flex gap={2} align="center">
          <TokenIcon fontSize="28px" tokenKey={networkAssetKey} />
          <Text variant="paragraph">{networkAssetName}</Text>
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenToConnector.Connector(TokenDestination)
