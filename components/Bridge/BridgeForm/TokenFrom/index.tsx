import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import TokenSelect from './TokenSelect'
import { TokenFromConnector } from './connector'

function TokenFrom({ inputValue, onChange }: TokenFromConnector.Props) {
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
        <Text>From</Text>
        <Text color="secondaryText">Balance: N/A</Text>
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
        {/* <Button variant="outline" color="secondaryText" size="sm">
          MAX
        </Button> */}

        <Divider orientation="vertical" />

        {/* Token Select */}
        <Flex>
          <TokenSelect />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TokenFromConnector.Connector(TokenFrom)
