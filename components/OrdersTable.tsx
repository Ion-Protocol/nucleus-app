import { selectAddress } from '@/store/slices/account'
import { Order, PaginatedResponse } from '@/types/Order'
import { Flex, Table, TableContainer, Text, useDisclosure } from '@chakra-ui/react'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { WalletMinimal } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { createOrderColumns } from '../utils/tableColumns'
import { ConnectAwareButton } from './shared/ConnectAwareButton'
import { Pagination } from './table/Pagination'
import { TableBody } from './table/TableBody'
import { TableHeader } from './table/TableHeader'
import WithdrawDetailsModal from './Withdraw/WithdrawalDetailModal/WithdrawlDetailsModal'

interface OrdersTableProps {
  data: Order[]
  pagination: PaginatedResponse['pagination']
  onCancelOrder: (order: Order) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  data,
  pagination,
  onCancelOrder,
  onPageChange,
  onPageSizeChange,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const columns = React.useMemo(() => createOrderColumns(onCancelOrder), [onCancelOrder])
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const userAddress = useSelector(selectAddress)

  const handleRowClick = useCallback((order: Order) => {
    setSelectedOrder(order)
    onOpen()
  }, [])

  return (
    <TableContainer>
      <Table variant="nucleus" size="sm">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} handleRowClick={handleRowClick} />
      </Table>
      {userAddress && (
        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
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
      <WithdrawDetailsModal isOpen={isOpen} onClose={onClose} order={selectedOrder} />
    </TableContainer>
  )
}

export default OrdersTable
