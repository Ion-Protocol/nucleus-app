import { TableBody } from '@/components/table/table-body'
import { TableHeader } from '@/components/table/table-header'
import { Pagination } from '@/components/table/table-pagination'
import { NetworkKey, networksConfig } from '@/config/networks'
import { useAppSelector } from '@/store/hooks'
import { selectAddress } from '@/store/slices/account'
import { AssetDataItem, selectAssetData, selectAssetDataLoading } from '@/store/slices/portfolio/selectors'
import { Flex, Table, TableContainer } from '@chakra-ui/react'
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { createAssetColumns } from './helpers'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'

const loadingData: AssetDataItem[] = Array.from({ length: 3 }, () => ({
  asset: TokenKey.ETH,
  network: ChainKey.ETHEREUM,
  allocation: 0,
  amount: 0,
  usdValue: 0,
  earningsApy: 0,
  rewardCount: 0,
}))

export function AssetsTable() {
  const router = useRouter()
  const data = useAppSelector(selectAssetData)
  const userAddress = useAppSelector(selectAddress)
  const isLoading = useAppSelector(selectAssetDataLoading)

  const handleMintMore = useCallback(
    (dataItem: AssetDataItem) => {
      const networkConfig = networksConfig[NetworkKey.MAINNET]
      const networkAssetConfig = networkConfig.assets[dataItem.asset]
      if (networkAssetConfig?.isExternal) {
        window.open(networkAssetConfig.partnerUrl, '_blank')
      } else {
        router.push(`/tokens/${dataItem.asset}`)
      }
    },
    [router]
  )

  const handleWithdraw = useCallback(
    (dataItem: AssetDataItem) => {
      const networkConfig = networksConfig[NetworkKey.MAINNET]
      const networkAssetConfig = networkConfig.assets[dataItem.asset]
      if (networkAssetConfig?.isExternal) {
        window.open(networkAssetConfig.partnerUrl, '_blank')
      } else {
        router.push(`/tokens/${dataItem.asset}`)
      }
    },
    [router]
  )

  const columns = React.useMemo(
    () => createAssetColumns(handleMintMore, handleWithdraw, isLoading),
    [handleMintMore, handleWithdraw, isLoading]
  )
  const table = useReactTable({
    debugTable: false,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const loadingTable = useReactTable({
    debugTable: false,
    data: loadingData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <TableContainer width="100%">
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody
          rows={!isLoading ? table.getRowModel().rows : loadingTable.getRowModel().rows}
          handleRowClick={() => {}}
          isLoading={isLoading}
          table={table}
        />
      </Table>
      {userAddress && !isLoading && (
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          pageSize={table.getState().pagination.pageSize}
          pageIndex={table.getState().pagination.pageIndex + 1}
          pageItems={table.getRowModel().rows.length.toLocaleString()}
          totalItems={table.getRowCount().toLocaleString()}
          totalPages={table.getPageCount()}
          onNextPage={() => table.nextPage()}
          onPreviousPage={() => table.previousPage()}
          hasNextPage={!table.getCanNextPage()}
          hasPreviousPage={!table.getCanPreviousPage()}
        />
      )}

      {/* Bottom Spacer */}
      <Flex h="50px" />
    </TableContainer>
  )
}
