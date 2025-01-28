import { AllocationFilter } from '@/store/slices/portfolio'
import { Menu, MenuButton, Button, MenuList, MenuItem, Text } from '@chakra-ui/react'
import { ChevronUpIcon } from 'lucide-react'

interface FilterMenuProps {
  value: AllocationFilter
  onChange: (filter: AllocationFilter) => void
}

export function FilterMenu({ value, onChange }: FilterMenuProps) {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronUpIcon size="16px" />}
        bg="bg.white"
        color="element.subdued"
        sx={{
          _hover: {
            bg: 'bg.main',
          },
          _active: {
            bg: 'bg.main',
          },
        }}
      >
        <Text variant="body-14">{value}</Text>
      </MenuButton>
      <MenuList bg="bg.white">
        <MenuItem bg="bg.white" sx={{ _hover: { bg: 'bg.main' } }} onClick={() => onChange(AllocationFilter.AssetType)}>
          <Text variant="body-14" color="element.main">
            Asset Type
          </Text>
        </MenuItem>
        <MenuItem bg="bg.white" sx={{ _hover: { bg: 'bg.main' } }} onClick={() => onChange(AllocationFilter.Network)}>
          <Text variant="body-14" color="element.main">
            Network
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
