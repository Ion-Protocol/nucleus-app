import { TokenIcon } from '@/components/config/tokenIcons'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { TokenSelectConnector } from './connector'

function TokenSelect({ selected, tokens, onChange }: TokenSelectConnector.Props) {
  return (
    <Menu>
      <MenuButton
        variant="outline"
        bg="none"
        size="sm"
        p={1}
        border="none"
        as={Button}
        textAlign="left"
        color={!selected ? 'disabled' : undefined}
      >
        {/* Token Selector Button */}
        <Flex align="center" gap={2}>
          {selected && <TokenIcon fontSize="28px" tokenKey={selected.key} />}
          <Text variant="xl">{selected.name}</Text>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>

      {/* Token List */}
      <MenuList bg="backgroundSecondary" zIndex={5}>
        {tokens.map((token) => (
          <MenuItem key={token.key} bg="none" onClick={() => onChange(token.key)} _hover={{ bg: 'hoverSecondary' }}>
            <Flex align="center" gap={3}>
              <TokenIcon fontSize="28px" tokenKey={token.key} />
              <Text variant="xl">{token.name}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default TokenSelectConnector.Connector(TokenSelect)
