import { Order } from '@/types/Order'
import { Tbody, Td, Tr } from '@chakra-ui/react'
import { Row, flexRender } from '@tanstack/react-table'

interface TableBodyProps {
  rows: Row<Order>[]
  handleRowClick: (order: Order) => void
}

export function TableBody({ rows, handleRowClick }: TableBodyProps) {
  return (
    <Tbody>
      {rows.map((row) => (
        <Tr key={row.id} onClick={() => handleRowClick(row.original)} _hover={{ cursor: 'pointer' }}>
          {row.getVisibleCells().map((cell) => (
            <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  )
}
