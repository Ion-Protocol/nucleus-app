import { Order } from '@/types/Order'
import { Tbody, Td, Tr } from '@chakra-ui/react'
import { Row, flexRender } from '@tanstack/react-table'

interface TableBodyProps {
  rows: Row<Order>[]
}

export function TableBody({ rows }: TableBodyProps) {
  return (
    <Tbody>
      {rows.map((row) => (
        <Tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  )
}
