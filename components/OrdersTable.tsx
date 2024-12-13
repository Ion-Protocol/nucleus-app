import { Order, PaginatedResponse } from '@/types/Order'
import { Box, Table, VStack } from '@chakra-ui/react'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import React from 'react'
import { createOrderColumns } from '../utils/tableColumns'
import { Pagination } from './table/Pagination'
import { TableBody } from './table/TableBody'
import { TableHeader } from './table/TableHeader'

interface OrdersTableProps {
  data: Order[]
  pagination: PaginatedResponse['pagination']
  onCancelOrder: (orderId: number) => void
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

  return (
    <VStack spacing={0} bg="white" borderRadius="md" shadow="sm">
      <Box w="full" overflowX="auto">
        <Table variant="simple">
          <TableHeader headerGroups={table.getHeaderGroups()} />
          <TableBody rows={table.getRowModel().rows} />
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
    // <Box overflowX="auto">
    //   <Table variant="simple">
    //     <TableHeader headerGroups={table.getHeaderGroups()} />
    //     <TableBody rows={table.getRowModel().rows} />
    //   </Table>
    // </Box>
  )
}

export default OrdersTable
