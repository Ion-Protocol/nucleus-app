import { NetworkKey, networksConfig } from '@/config/networks'
import { DashboardTableDataItem } from '@/types'
import { TokenKey } from '@/types/TokenKey'
import { Button, Flex, Table, TableContainer, Text } from '@chakra-ui/react'
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { AtomTag } from '../shared/AtomTag'
import { ChainIconRow } from '../shared/chain-icon-row'
import { MintIcon } from '../shared/icons/Mint'
import { TableBody } from '../table/table-body'
import { TableHeader } from '../table/table-header'
import { AssetCell } from './asset-cell'
import { NetworkAssetTooltip } from './NetworkAssetItem/network-asset-tooltip'
import { useNetworkAssetTableData } from './useNetworkAssetTableData'

export function NetworkAssetTable() {
  const router = useRouter()
  const data = useNetworkAssetTableData()

  function handleClickRow(row: DashboardTableDataItem) {
    const networkAsset = networksConfig[NetworkKey.MAINNET].assets[row.asset]
    if (networkAsset?.isExternal) {
      window.open(networkAsset.partnerUrl, '_blank')
    } else {
      router.push(`/tokens/${networkAsset?.token.name?.toLowerCase()}`)
    }
  }

  const columnHelper = createColumnHelper<DashboardTableDataItem>()
  const columns = [
    columnHelper.accessor('asset', {
      header: 'Asset',
      cell: (info) => <AssetCell info={info} />,
    }),
    columnHelper.accessor('tvl', {
      header: 'TVL',
      cell: (info) => <Text variant="body-16">{info.getValue()}</Text>,
    }),
    columnHelper.accessor('apy', {
      header: 'APY and Benefits',
      cell: (info) => (
        <Flex align="center" gap={3}>
          <Text variant="body-16">{info.getValue()}</Text>
          <AtomTag tooltip={<NetworkAssetTooltip networkAssetKey={info.row.original.asset as TokenKey} />}>
            12 Rewards
          </AtomTag>
        </Flex>
      ),
    }),
    columnHelper.accessor('applications', {
      header: 'Applications',
      cell: (info) => <ChainIconRow chains={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Flex justify="flex-end">
          <Button onClick={() => handleClickRow(row.original)} variant="outline" leftIcon={<MintIcon pb="1px" />}>
            <Text variant="body-16">Mint</Text>
          </Button>
        </Flex>
      ),
    }),
  ]

  const table = useReactTable({
    debugTable: false,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <TableContainer width="100%">
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} bg="bg.white" />
        <TableBody rows={table.getRowModel().rows} handleRowClick={handleClickRow} table={table} />
      </Table>

      {/* Bottom Spacer */}
      <Flex h="50px" />
    </TableContainer>
  )
}
