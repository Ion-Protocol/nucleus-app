import { TokenKey } from '@/types/TokenKey'
import {
  Box,
  Button,
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

interface TokenFilterProps {
  selectedTokens: string[]
  onChange: (values: string[]) => void
}

const tokenMapping = {
  [TokenKey.SSETH]: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
  [TokenKey.FETH]: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
  [TokenKey.RARIETH]: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
  [TokenKey.UNIFIETH]: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
  [TokenKey.EARNETH]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
  [TokenKey.TETH]: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
}

export const MultiSelectTokenFilter: React.FC<TokenFilterProps> = ({ selectedTokens, onChange }) => {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredTokens = Object.entries(tokenMapping).filter(([key]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Menu closeOnSelect={false} offset={[-86, 10]}>
      {({ isOpen }) => (
        <>
          <MenuButton
            fontFamily="diatype"
            fontWeight="normal"
            fontSize="14px"
            as={Button}
            variant="ghost"
            width="fit-content"
            rightIcon={
              isOpen ? <ChevronUpIcon size={16} strokeWidth={1.5} /> : <ChevronDownIcon size={16} strokeWidth={1.5} />
            }
          >
            By Asset Type
          </MenuButton>
          <MenuList fontFamily="diatype" fontWeight="normal" fontSize="14px" width="200px">
            <Box px={4} py={2}>
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
              {filteredTokens.map(([key, value]) => (
                <MenuItemOption key={value} value={value}>
                  {key}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  )
}
