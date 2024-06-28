import { IonCard } from '@/components/shared/IonCard'
import { Flex, Input, Text } from '@chakra-ui/react'
import TokenSelect from '../TokenSelect'
import { TokenToConnector } from './connector'

function TokenTo({ to, tokens, selectedToken, onChangeToken }: TokenToConnector.Props) {
  return (
    <IonCard variant="elevate">
      {/* Top Row */}
      <Flex justify="space-between">
        <Text>To</Text>
        <Text color="secondaryText">Balance: N/A</Text>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3}>
        {/* Input Box */}
        <Input
          disabled
          _disabled={{
            cursor: 'text',
          }}
          cursor="pointer"
          value={to}
          variant="unstyled"
          size="lg"
          placeholder="Amount"
          fontWeight="bold"
        />

        <Flex gap={3} align="center">
          {/* Token Select */}
          <TokenSelect tokens={tokens} selected={selectedToken} onChange={onChangeToken} />
        </Flex>
      </Flex>
    </IonCard>
  )
}

export default TokenToConnector.Connector(TokenTo)
