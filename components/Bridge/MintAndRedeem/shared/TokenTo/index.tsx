import { TokenIcon } from '@/components/config/tokenIcons'
import { IonCard } from '@/components/shared/IonCard'
import { Flex, Input, Skeleton, Text } from '@chakra-ui/react'
import { TokenToConnector } from './connector'

function TokenTo({ value, bridgeToken, tokenBalance, loadingTokenBalance }: TokenToConnector.Props) {
  return (
    <IonCard variant="elevate">
      {/* Top Row */}
      <Flex justify="space-between">
        <Text>Receive</Text>
        <Flex color="secondaryText" gap={1}>
          <Text>Balance: </Text>
          <Skeleton isLoaded={!loadingTokenBalance} minW="25px">
            <Text>{tokenBalance}</Text>
          </Skeleton>
        </Flex>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3}>
        {/* Input Box */}
        <Input
          disabled
          _disabled={{
            cursor: 'text',
            color: 'disabled',
          }}
          cursor="pointer"
          value={value}
          variant="unstyled"
          size="lg"
          placeholder="Amount"
          fontWeight="bold"
        />

        <Flex gap={2} align="center">
          <TokenIcon fontSize="28px" tokenKey={bridgeToken?.key || null} />
          <Text variant="xl">{bridgeToken?.name}</Text>
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenToConnector.Connector(TokenTo)
