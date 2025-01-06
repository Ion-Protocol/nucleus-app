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
  [TokenKey.UNIFIETH]: '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
  [TokenKey.EARNETH]: '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
  [TokenKey.TETH]: '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
}

const statusValuesMapping: Record<string, string> = {
  Filled: 'fulfilled',
  Pending: 'pending',
  Expired: 'cancelled',
}

interface OrdersTableProps {
  data: Order[]
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data }) => {
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

  const columns = React.useMemo(() => createOrderColumns(handleCancelOrder), [handleCancelOrder])
  const table = useReactTable({
    debugTable: false,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        />
        <MultiSelectFilter title="By Status" onChange={setSelectedStatus} options={statusValuesMapping} />
      </Flex>
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} handleRowClick={handleRowClick} />
      </Table>
      {userAddress && (
        <Pagination
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
      <CancelWithdrawDialog isOpen={isCancelOpen} onClose={onCancelClose} order={selectedOrderToCancel!} />
    </TableContainer>
  )
}

export default OrdersTable
