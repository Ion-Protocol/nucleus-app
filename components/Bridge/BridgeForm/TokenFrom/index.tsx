import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import TokenSelect from './TokenSelect'
import { TokenInputConnector } from './connector'

function TokenFrom({ inputValue, onChange }: TokenInputConnector.Props) {
  return (
    <Flex
      direction="column"
      border="1px solid"
      borderColor="border"
      borderRadius="8px"
      p={4}
      bg="backgroundSecondary"
      gap={4}
    >
      {/* Top Row */}
      <Flex justify="space-between">
        <Text fontSize="sm">From</Text>
        <Text fontSize="sm" color="secondaryText">
          Balance: 35.422 ETH
        </Text>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3}>
        {/* Input Box */}
        <Input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          type="number"
          variant="unstyled"
          size="lg"
          placeholder="Amount"
          fontWeight="bold"
        />

        {/* Max Button */}
        <Button variant="outline" color="secondaryText" size="sm">
          MAX
        </Button>

        <Divider orientation="vertical" />

        {/* Token Select */}
        <Flex>
          <TokenSelect />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TokenInputConnector.Connector(TokenFrom)
