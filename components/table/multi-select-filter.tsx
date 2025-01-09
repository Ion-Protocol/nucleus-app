import { TokenKey } from '@/types/TokenKey'
import { capitalizeFirstLetter } from '@/utils/string'
import { getSymbolByAddress } from '@/utils/withdrawal'
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon, Globe, SearchIcon } from 'lucide-react'
import React from 'react'
import { Address } from 'viem'
import { TokenIcon } from '../config/tokenIcons'

interface MultiSelectFilterProps {
  title: string
  onChange: (values: string[]) => void
  options: Record<string, string>
  isAssetFilter?: boolean
  selectedValues: string[]
}

export const MultiSelectFilter = ({
  title,
  options,
  onChange,
  isAssetFilter,
  selectedValues,
}: MultiSelectFilterProps) => {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredValues = Object.entries(options).filter(([key]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCheckboxChange = (values: string[]) => {
    onChange(values)
  }

  return (
    <Popover placement="bottom-end">
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Button
              variant="ghost"
              fontFamily="diatype"
              fontWeight="normal"
              size="sm"
              fontSize="14px"
              _hover={{ bg: 'bg.secondary' }}
              backgroundColor={isOpen ? 'bg.main' : 'transparent'}
              color={'element.subdued'}
              rightIcon={
                isOpen ? <ChevronUpIcon size={16} strokeWidth={1.5} /> : <ChevronDownIcon size={16} strokeWidth={1.5} />
              }
            >
              {title}
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent width="fit-content" minWidth="200px" borderRadius="8px" bg="bg.white">
              {isAssetFilter && (
                <Box pt={2} px={2}>
                  <InputGroup alignItems={'center'}>
                    <InputLeftElement color="stroke.main">
                      <SearchIcon size={20} strokeWidth={2} />
                    </InputLeftElement>
                    <Input
                      bg="bg.main"
                      borderColor="stroke.main"
                      borderRadius="8px"
                      fontFamily="diatype"
                      fontWeight="normal"
                      fontSize="14px"
                      placeholder="Search token"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <InputRightElement color="stroke.main">
                      <Globe size={20} strokeWidth={1} />
                    </InputRightElement>
                  </InputGroup>
                </Box>
              )}
              <PopoverBody display="flex" flexDirection="column" padding={2}>
                <CheckboxGroup value={selectedValues} onChange={handleCheckboxChange}>
                  {filteredValues.map(([key, value]) => (
                    <Checkbox
                      key={key}
                      value={value}
                      colorScheme="blackAlpha"
                      fontFamily="diatype"
                      fontWeight="normal"
                      borderRadius="lg"
                      fontSize="sm"
                      px={2}
                      py={4}
                      _hover={{ bg: 'bg.secondary' }}
                    >
                      {isAssetFilter ? (
                        <Flex alignItems={'center'} gap={2}>
                          <TokenIcon
                            height={'16px'}
                            width={'16px'}
                            tokenKey={getSymbolByAddress(value as Address)?.toLowerCase() as TokenKey}
                          />
                          <span>{getSymbolByAddress(value as Address)}</span>
                        </Flex>
                      ) : (
                        capitalizeFirstLetter(key)
                      )}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  )
}
