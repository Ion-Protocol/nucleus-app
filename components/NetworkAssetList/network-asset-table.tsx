import { NetworkKey, networksConfig } from '@/config/networks'
import { DashboardTableDataItem } from '@/types'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Button, Flex, Icon, Table, TableContainer, Text } from '@chakra-ui/react'
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { LinkExternal02 } from '@untitled-ui/icons-react'
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
  const { data, isLoading } = useNetworkAssetTableData()

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesAsset =
        selectedAssets.length === 0 || selectedAssets.includes(tokenAddressMapping[item.asset] as string)
      const matchesNetwork = selectedNetworks.length === 0 || selectedNetworks.includes(item.chain as string)
      // ! Remove RARI from the list. This is temporary while we depreciate RARI and remove it all together.
      const isNotRari = item.chain !== ChainKey.RARI
      const isNotSupUsd = item.asset !== TokenKey.SUPUSD

      return matchesAsset && matchesNetwork && isNotRari && isNotSupUsd
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
      cell: (info) => {
        const networkAssetCount =
          networksConfig[NetworkKey.MAINNET].assets[info.row.original.asset as TokenKey]?.points.length
        return (
          <Flex align="center" gap={3}>
            <Text variant="body-16" w="3rem">
              {info.getValue()}
            </Text>
            <AtomTag tooltip={<NetworkAssetTooltip networkAssetKey={info.row.original.asset as TokenKey} />}>
              {networkAssetCount} Rewards
            </AtomTag>
          </Flex>
        )
      },
    }),
    columnHelper.accessor('applications', {
      header: 'Applications',
      cell: (info) => <ChainIconRow chains={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const networkAsset = networksConfig[NetworkKey.MAINNET].assets[row.original.asset as TokenKey]
        const isExternal = networkAsset?.isExternal
        return (
          <Flex justify="flex-end">
            <Button
              onClick={() => handleClickRow(row.original)}
              variant="outline"
              leftIcon={
                isExternal ? (
                  <Icon
                    as={LinkExternal02}
                    boxSize={4}
                    sx={{
                      path: {
                        strokeWidth: '1px',
                      },
                    }}
                  />
                ) : (
                  <MintIcon boxSize={4} />
                )
              }
            >
              <Text variant="body-16">Mint</Text>
            </Button>
          </Flex>
        )
      },
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
        <TableBody rows={table.getRowModel().rows} table={table} isLoading={isLoading} />
      </Table>

      {/* Bottom Spacer */}
      <Flex h="50px" />
    </TableContainer>
  )
}
