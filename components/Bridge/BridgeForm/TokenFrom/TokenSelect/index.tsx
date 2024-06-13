import { TokenIcon } from '@/components/config/tokenIcons'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { TokenSelectConnector } from './connector'

function TokenSelect({ selected, tokens, onChange }: TokenSelectConnector.Props) {
  return (
    <Menu>
      <MenuButton
        variant="outline"
        size="sm"
        p={1}
        border="none"
        as={Button}
        textAlign="left"
        color={!selected ? 'disabled' : undefined}
      >
        <Flex align="center" gap={1}>
          {selected && <TokenIcon tokenKey={selected.key} />}
          <Text>{selected.name}</Text>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList bg="backgroundSecondary">
        {tokens.map((token) => (
          <MenuItem key={token.key} bg="none" onClick={() => onChange(token.key)} _hover={{ bg: 'hoverSecondary' }}>
            <Flex align="center" gap={3}>
              <TokenIcon tokenKey={token.key} />
              <Text>{token.name}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default TokenSelectConnector.Connector(TokenSelect)
