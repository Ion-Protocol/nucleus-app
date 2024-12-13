import { Order } from '@/types/Order'
import { Box, Table } from '@chakra-ui/react'
import { getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import React from 'react'
import { createOrderColumns } from '../utils/tableColumns'
import { TableBody } from './table/TableBody'
import { TableHeader } from './table/TableHeader'

interface OrdersTableProps {
  data: Order[]
  onCancelOrder: (orderId: number) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data, onCancelOrder }) => {
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
  })

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} />
      </Table>
    </Box>
  )
}

export default OrdersTable
