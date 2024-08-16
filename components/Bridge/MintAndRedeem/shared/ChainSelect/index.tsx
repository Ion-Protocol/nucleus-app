import { BridgeIcon } from '@/components/config/bridgeIcons'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { ChainSelectConnector } from './connector'

function ChainSelect({
  chains,
  onChange,
  selected,
  placeholder,
  primaryText,
  isActive,
  role,
}: ChainSelectConnector.Props) {
  return (
    <Menu>
      <MenuButton
        variant="outline"
        borderWidth="1px"
        borderColor={role === 'source' ? 'border' : 'borderLight'}
        as={Button}
        rightIcon={isActive ? <ChevronDownIcon /> : undefined}
        textAlign="left"
        color={!selected ? 'disabled' : undefined}
        bg={role === 'source' ? 'none' : 'formBackground'}
        pointerEvents={role === 'source' ? 'auto' : 'none'}
      >
        <Flex align="center" gap={3}>
          {selected && <BridgeIcon bridgeKey={selected.key} />}
          <Text variant="medium">{selected ? primaryText : placeholder}</Text>
        </Flex>
      </MenuButton>
      <MenuList bg="backgroundSecondary">
        {chains.map((chain) => (
          <MenuItem key={chain.key} bg="none" onClick={() => onChange(chain.key)} _hover={{ bg: 'hover' }}>
            <Flex align="center" gap={3}>
              <BridgeIcon bridgeKey={chain.key} />
              <Text variant="medium">{chain.name}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ChainSelectConnector.Connector(ChainSelect)
