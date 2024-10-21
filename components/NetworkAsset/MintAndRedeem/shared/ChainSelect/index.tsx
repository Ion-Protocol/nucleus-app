import { ChainIcon } from '@/components/config/chainIcons'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { ChainSelectConnector } from './connector'

function ChainSelect({
  chains,
  onChange,
  selectedChainKey,
  placeholder,
  primaryText,
  isActive,
  role,
}: ChainSelectConnector.Props) {
  console.log('chains in ChainSelect', chains)
  return (
    <Menu matchWidth>
      <MenuButton
        variant="outline"
        borderWidth="1px"
        borderColor={role === 'source' ? 'border' : 'borderLight'}
        as={Button}
        rightIcon={isActive ? <ChevronDownIcon /> : undefined}
        textAlign="left"
        color={!selectedChainKey ? 'disabled' : undefined}
        bg={role === 'source' ? 'none' : 'formBackground'}
        pointerEvents={role === 'source' ? 'auto' : 'none'}
      >
        <Flex align="center" gap={3}>
          {selectedChainKey && <ChainIcon chainKey={selectedChainKey} />}
          <Text variant="paragraph">{selectedChainKey ? primaryText : placeholder}</Text>
        </Flex>
      </MenuButton>
      <MenuList bg="backgroundSecondary" w="100%" px={3}>
        {chains.map((chain) => (
          <MenuItem
            key={chain.key}
            bg="none"
            onClick={() => onChange(chain.key)}
            border="1px solid"
            borderColor="transparent"
            _hover={{ bg: 'hoverSecondary', border: '1px solid', borderColor: 'border', borderRadius: '8px' }}
          >
            <Flex align="center" gap={3}>
              <ChainIcon chainKey={chain.key} />
              <Text variant="medium">{chain.name}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ChainSelectConnector.Connector(ChainSelect)
