import { TokenIcon } from '@/components/config/tokenIcons'
import { TokenKey } from '@/config/token'
import { Divider, Flex, Input, Text } from '@chakra-ui/react'
import { TokenToConnector } from './connector'

function TokenTo({ to }: TokenToConnector.Props) {
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

        <Divider orientation="vertical" />
        <Flex align="center" gap={2} ml={1} mr={3}>
          <TokenIcon fontSize="28px" tokenKey={TokenKey.SEI} />
          <Text fontWeight="bold" fontSize="xl" pt="4px">
            SEI
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TokenToConnector.Connector(TokenTo)
