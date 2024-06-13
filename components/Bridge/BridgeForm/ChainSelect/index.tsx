import { ChevronDownIcon } from '@chakra-ui/icons'
import { Text, Button, Menu, MenuButton, MenuList, MenuItem, Flex } from '@chakra-ui/react'
import { ChainSelectConnector } from './connector'
import { ChainIcon, chainIconMap } from '@/components/config/chainIcons'

function ChainSelect({
  chains,
  onChange,
  selected,
}: ChainSelectConnector.Props & { onChange: (chainKey: string) => void }) {
  return (
    <Menu>
      <MenuButton
        variant="outline"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        textAlign="left"
        color={!selected ? 'disabled' : undefined}
      >
        <Flex align="center" gap={3}>
          {selected && <ChainIcon chainKey={selected.key} />}
          <Text>{selected ? selected.name : 'Source Chain'}</Text>
        </Flex>
      </MenuButton>
      <MenuList bg="backgroundSecondary">
        {chains.map((chain) => (
          <MenuItem key={chain.key} bg="none" onClick={() => onChange(chain.key)} _hover={{ bg: 'hoverSecondary' }}>
            <Flex align="center" gap={3}>
              <ChainIcon chainKey={chain.key} />
              <Text>{chain.name}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default ChainSelectConnector.Connector(ChainSelect)
