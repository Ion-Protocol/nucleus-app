import { NetworkKey, networksConfig } from '@/config/networks'
import { DashboardTableDataItem } from '@/types'
import { TokenKey } from '@/types/TokenKey'
import { Button, Flex, Table, TableContainer, Text } from '@chakra-ui/react'
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { tokenAddressMapping } from '.'
import { AtomTag } from '../shared/AtomTag'
import { ChainIconRow } from '../shared/chain-icon-row'
import { MintIcon } from '../shared/icons/Mint'
import { SortableHeader } from '../table/sortable-header'
import { TableBody } from '../table/table-body'
import { TableHeader } from '../table/table-header'
import { AssetCell } from './asset-cell'
import { NetworkAssetTooltip } from './NetworkAssetItem/network-asset-tooltip'
import { useNetworkAssetTableData } from './useNetworkAssetTableData'

interface NetworkAssetTableProps {
  selectedAssets: string[]
  selectedNetworks: string[]
}

export function NetworkAssetTable({ selectedAssets, selectedNetworks }: NetworkAssetTableProps) {
  const router = useRouter()
  const data = useNetworkAssetTableData()

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesAsset =
        selectedAssets.length === 0 || selectedAssets.includes(tokenAddressMapping[item.asset] as string)
      const matchesNetwork = selectedNetworks.length === 0 || selectedNetworks.includes(item.chain as string)

      return matchesAsset && matchesNetwork
    })
  }, [data, selectedAssets, selectedNetworks])

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
      header: ({ column }) => <SortableHeader column={column}>TVL</SortableHeader>,
      cell: (info) => <Text variant="body-16">{info.getValue().formatted}</Text>,
      sortingFn: (rowA, rowB, columnId) => {
        const tvlA = (rowA.getValue(columnId) as { value: number }).value
        const tvlB = (rowB.getValue(columnId) as { value: number }).value
        return tvlA - tvlB // Ascending sort
      },
    }),
    columnHelper.accessor('apy', {
      header: ({ column }) => <SortableHeader column={column}>APY and Benefits</SortableHeader>,
      cell: (info) => (
        <Flex align="center" gap={3}>
          <Text variant="body-16" w="3em">
            {info.getValue()}
          </Text>
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
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: 'tvl',
          desc: true,
        },
      ],
    },
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
