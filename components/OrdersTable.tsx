import { Order, PaginatedResponse } from '@/types/Order'
import { Box, Table, useDisclosure, VStack } from '@chakra-ui/react'
import { getCoreRowModel, getSortedRowModel, Row, SortingState, useReactTable } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { createOrderColumns } from '../utils/tableColumns'
import { Pagination } from './table/Pagination'
import { TableBody } from './table/TableBody'
import { TableHeader } from './table/TableHeader'
import WithdrawDetailsModal from './Withdraw/WithdrawalDetailModal/WithdrawlDetailsModal'

interface OrdersTableProps {
  data: Order[]
  pagination: PaginatedResponse['pagination']
  onCancelOrder: (orderId: number) => void
  onRowClick: (row: Row<Order>) => void
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

  const handleRowClick = useCallback((order: Order) => {
    setSelectedOrder(order)
    onOpen()
  }, [])

  return (
    <>
      <VStack spacing={0} bg="white" borderRadius="md" shadow="sm" gap={2}>
        <Box w="full" overflowX="auto">
          <Table variant="simple">
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <TableBody rows={table.getRowModel().rows} handleRowClick={handleRowClick} />
          </Table>
        </Box>
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
      </VStack>
      <WithdrawDetailsModal isOpen={isOpen} onClose={onClose} order={selectedOrder} />
    </>
  )
}

export default OrdersTable
