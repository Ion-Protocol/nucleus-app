import { Skeleton, Tbody, Td, Tr } from '@chakra-ui/react'
import { Row, Table, flexRender } from '@tanstack/react-table'

// TODO: update to be a generic type instead of order?
interface TableBodyProps {
  table: Table<any>
  rows: Row<any>[]
  isLoading?: boolean
}

export function TableBody({ rows, isLoading, table }: TableBodyProps) {
  if (isLoading) {
    return (
      <Tbody>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <Tr key={rowIndex}>
            {table.getAllColumns().map((column) => (
              <Td key={column.id}>
                <Skeleton height="20px" />
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    )
  }

  return (
    <Tbody>
      {rows.map((row) => (
        <Tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <Td key={cell.id} textAlign="left" pl={3}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  )
}
