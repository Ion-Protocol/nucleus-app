import { NetworkKey, networksConfig } from '@/config/networks'
import { AssetDataItem } from '@/store/slices/portfolio/selectors'
import { Text, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { Row } from '@tanstack/react-table'
import { EllipsisIcon, LogOutIcon, PlusIcon, WalletIcon } from 'lucide-react'
import { useMemo } from 'react'

interface ActionCellProps {
  handleMintMore: (dataItem: AssetDataItem) => void
  handleWithdraw: (dataItem: AssetDataItem) => void
  row: Row<any>
}

export function ActionCell({ handleMintMore, handleWithdraw, row }: ActionCellProps) {
  const networkConfig = networksConfig[NetworkKey.MAINNET]
  const networkAssetkeys = useMemo(() => {
    return Object.keys(networkConfig.assets)
  }, [networkConfig.assets])

  const actionEnabled = networkAssetkeys.includes(row.original.asset)

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<EllipsisIcon size={24} />}
        aria-label="More options"
        variant="ghost"
        color="element.subdued"
      />
      <MenuList bg="bg.white" border="1px solid" borderColor="stroke.main" py={3} px={2}>
        <MenuItem
          bg="bg.white"
          onClick={() => actionEnabled && handleMintMore(row.original)}
          sx={{ _hover: { bg: actionEnabled ? 'bg.main' : 'bg.white' }, opacity: actionEnabled ? 1 : 0.5 }}
          color="element.lighter"
          gap={3}
          py={3}
          isDisabled={!actionEnabled}
        >
          <PlusIcon size={16} />
          <Text variant="body-14">Mint More</Text>
        </MenuItem>
        <MenuItem
          bg="bg.white"
          onClick={() => actionEnabled && handleWithdraw(row.original)}
          sx={{ _hover: { bg: actionEnabled ? 'bg.main' : 'bg.white' }, opacity: actionEnabled ? 1 : 0.5 }}
          color="element.lighter"
          gap={3}
          py={3}
          isDisabled={!actionEnabled}
        >
          <LogOutIcon size={16} />
          <Text variant="body-14">Withdraw</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
