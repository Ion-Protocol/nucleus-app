import { selectAddress } from '@/store/slices/account'
import { Order } from '@/types/Order'
import { TokenKey } from '@/types/TokenKey'
import { Button, Flex, Link, Table, TableContainer, Text, useDisclosure } from '@chakra-ui/react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { WalletMinimal } from 'lucide-react'
import NextLink from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Address } from 'viem'
import { createOrderColumns } from '../utils/tableColumns'
import { ConnectAwareButton } from './shared/ConnectAwareButton'
import { MultiSelectFilter } from './table/multi-select-filter'
import { TableBody } from './table/table-body'
import { TableHeader } from './table/table-header'
import { Pagination } from './table/table-pagination'
import CancelWithdrawDialog from './Withdraw/CancelWithdrawDialog/cancel-withdraw-dialog'
import WithdrawDetailsModal from './Withdraw/WithdrawalDetailModal/withdraw-detail-modal'

const tokenValuesMapping: Partial<Record<TokenKey, Address>> = {
  [TokenKey.SSETH]: '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
  [TokenKey.FETH]: '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
  [TokenKey.RARIETH]: '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
  [TokenKey.UNIFIETH]: '0x196ead472583Bc1e9aF7A05F860D9857e1Bd3dCc',
  [TokenKey.EARNETH]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
  [TokenKey.TETH]: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
  [TokenKey.BOBAETH]: '0x52E4d8989fa8b3E1C06696e7b16DEf5d7707A0d1',
  [TokenKey.NELIXIR]: '0x9fbC367B9Bb966a2A537989817A088AFCaFFDC4c',
  [TokenKey.UNIFIBTC]: '0x170D847A8320F3B6A77eE15B0CAE430e3eC933a0',
}

export const statusValuesMapping: Record<string, string> = {
  Filled: 'fulfilled',
  Pending: 'pending',
  Expired: 'expired',
  Cancelled: 'cancelled',
}

interface OrdersTableProps {
  data: Order[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data, refetch, isLoading }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  })
  const [selectedTokens, setSelectedTokens] = React.useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null)
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure()

  const handleCancelOrder = useCallback(
    (order: Order) => {
      setSelectedOrderToCancel(order)
      onCancelOpen()
    },
    [onCancelOpen]
  )

  const handleCancelClose = () => {
    onCancelClose()
    setSelectedOrderToCancel(null)
    refetch()
  }

  const columns = React.useMemo(() => createOrderColumns(handleCancelOrder), [handleCancelOrder])
  const table = useReactTable({
    debugTable: false,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  const userAddress = useSelector(selectAddress)

  const handleRowClick = useCallback(
    (order: Order) => {
      setSelectedOrder(order)
      onDetailsOpen()
    },
    [onDetailsOpen]
  )

  const handleClearFilters = () => {
    setSelectedTokens([])
    setSelectedStatus([])
    table.resetColumnFilters()
  }

  useEffect(() => {
    table.setColumnFilters([
      {
        id: 'offer_token',
        value: selectedTokens,
      },
      {
        id: 'status',
        value: selectedStatus,
      },
    ])
  }, [selectedTokens, selectedStatus, table])

  return (
    <TableContainer>
      <Flex gap={2} justifyContent={'flex-end'} alignItems={'baseline'} pb={3}>
        {(selectedTokens.length > 0 || selectedStatus.length > 0) && (
          <Button
            color="element.subdued"
            variant="link"
            onClick={handleClearFilters}
            fontFamily="diatype"
            fontWeight="normal"
            size="sm"
            fontSize="14px"
            textTransform="uppercase"
          >
            Clear Filters
          </Button>
        )}
        <MultiSelectFilter
          title="By Asset Type"
          onChange={setSelectedTokens}
          options={tokenValuesMapping}
          isAssetFilter={true}
          selectedValues={selectedTokens}
        />
        <MultiSelectFilter
          title="By Status"
          onChange={setSelectedStatus}
          options={statusValuesMapping}
          selectedValues={selectedStatus}
        />
      </Flex>
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody
          isLoading={isLoading}
          table={table}
          rows={table.getRowModel().rows}
          handleRowClick={handleRowClick}
        />
      </Table>
      {userAddress && (
        <Pagination
          pageSize={pagination.pageSize}
          pageIndex={pagination.pageIndex + 1}
          currentPage={table.getState().pagination.pageIndex + 1}
          pageItems={table.getRowModel().rows.length.toLocaleString()}
          totalItems={table.getRowCount().toLocaleString()}
          totalPages={table.getPageCount()}
          onNextPage={() => table.nextPage()}
          onPreviousPage={() => table.previousPage()}
          hasNextPage={!table.getCanNextPage()}
          hasPreviousPage={!table.getCanPreviousPage()}
        />
      )}
      {!userAddress && (
        <Flex justifyContent={'center'} height={'10rem'}>
          <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
            <Text>Your wallet is not connected</Text>
            <ConnectAwareButton leftIcon={<WalletMinimal />} variant={'outline'} />
          </Flex>
        </Flex>
      )}
      {!data.length && (
        <Flex justifyContent={'center'} height={'10rem'}>
          <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
            <Text fontFamily="diatype" fontSize="sm" color="element.subdued">
              You haven&apos;t made any withdrawals yet
            </Text>
            <Link as={NextLink} href="/dashboard" _hover={{ textDecoration: 'none' }}>
              <Button variant={'outline'} fontWeight="normal">
                Deposit Now
              </Button>
            </Link>
          </Flex>
        </Flex>
      )}
      <WithdrawDetailsModal isOpen={isDetailsOpen} onClose={onDetailsClose} order={selectedOrder} />
      {selectedOrderToCancel && (
        <CancelWithdrawDialog isOpen={isCancelOpen} onClose={handleCancelClose} order={selectedOrderToCancel} />
      )}
    </TableContainer>
  )
}

export default OrdersTable
