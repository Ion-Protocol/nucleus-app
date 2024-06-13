import { Button, Divider, Flex, Input, Text } from '@chakra-ui/react'
import { TokenSelectConnector } from './connector'

function TokenSelect({ role }: TokenSelectConnector.Props) {
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
        <Text fontSize="sm">{role === 'from' ? 'From' : 'To'}</Text>
        <Text fontSize="sm" color="secondaryText">
          Balance: 35.422 ETH
        </Text>
      </Flex>

      {/* Bottom Row */}
      <Flex align="center" gap={3}>
        {/* Input Box */}
        <Input variant="unstyled" size="lg" placeholder="Amount" fontWeight="bold" />

        {/* Max Button */}
        <Button variant="outline" color="secondaryText" size="sm">
          MAX
        </Button>

        <Divider orientation="vertical" />

        {/* Token Select */}
      </Flex>
    </Flex>
  )
}

export default TokenSelectConnector.Connector(TokenSelect)
