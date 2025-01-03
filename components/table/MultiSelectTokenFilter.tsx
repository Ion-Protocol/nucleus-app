import { TokenKey } from '@/types/TokenKey'
import { getSymbolByAddress } from '@/utils/withdrawal'
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, Globe, SearchIcon } from 'lucide-react'
import React from 'react'
import { Address } from 'viem'
import { TokenIcon } from '../config/tokenIcons'

interface TokenFilterProps {
  selectedTokens: string[]
  onChange: (values: string[]) => void
}

const tokenValues: Address[] = [
  '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
  '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
  '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
  '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
  '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
  '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
]

export const MultiSelectTokenFilter: React.FC<TokenFilterProps> = ({ selectedTokens, onChange }) => {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredTokens = tokenValues.filter((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Menu closeOnSelect={false} offset={[-84, 10]}>
      {({ isOpen }) => (
        <>
          <MenuButton
            fontFamily="diatype"
            fontWeight="normal"
            fontSize="14px"
            as={Button}
            size="sm"
            variant="ghost"
            width="fit-content"
            rightIcon={
              isOpen ? <ChevronUpIcon size={16} strokeWidth={1.5} /> : <ChevronDownIcon size={16} strokeWidth={1.5} />
            }
          >
            By Asset Type
          </MenuButton>
          <MenuList fontFamily="diatype" fontWeight="normal" fontSize="14px" width="200px" px={2}>
            <Box pb={1}>
              <InputGroup alignItems={'center'}>
                <InputLeftElement>
                  <SearchIcon size={20} strokeWidth={1.5} />
                </InputLeftElement>
                <Input
                  placeholder="Search token"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement>
                  <Globe size={20} strokeWidth={1} />
                </InputRightElement>
              </InputGroup>
            </Box>
            <MenuOptionGroup type="checkbox" value={selectedTokens} onChange={(values) => onChange(values as string[])}>
              {filteredTokens.map((value) => (
                <MenuItemOption key={value} value={value} borderRadius={'8px'}>
                  <Flex alignItems={'center'} gap={2}>
                    <TokenIcon
                      height={'16px'}
                      width={'16px'}
                      tokenKey={getSymbolByAddress(value)?.toLowerCase() as TokenKey}
                    />
                    <span>{getSymbolByAddress(value)}</span>
                  </Flex>
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  )
}
