import { TokenIcon } from '@/components/config/tokenIcons'
import { Token } from '@/types/Token'
import { TokenKey } from '@/types/TokenKey'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'

interface TokenSelectProps {
  tokens: Token[]
  selected: Token | null
  onChange: (tokenKey: TokenKey) => void
}

function TokenSelect({ selected, tokens, onChange }: TokenSelectProps) {
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
          <Text variant="paragraph">{selected?.name}</Text>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>

      {/* Token List */}
      <MenuList bg="backgroundSecondary" zIndex={5} px={3}>
        {tokens.map((token) => (
          <MenuItem
            key={token.key}
            bg="none"
            onClick={() => onChange(token.key)}
            border="1px solid"
            borderColor="transparent"
            _hover={{ bg: 'hoverSecondary', border: '1px solid', borderColor: 'border', borderRadius: '8px' }}
          >
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

export default TokenSelect
