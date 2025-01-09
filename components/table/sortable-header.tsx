import { Box } from '@chakra-ui/react'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import React from 'react'

interface SortableHeaderProps<T> {
  column: Column<T>
  children: React.ReactNode
}

export function SortableHeader<T>({ column, children }: SortableHeaderProps<T>) {
  return (
    <Box
      _hover={{ bg: 'none' }}
      _active={{ bg: 'transparent' }}
      display={'flex'}
      gap={2}
      justifyContent={'flex-start'}
      cursor="pointer"
      onClick={() => column.toggleSorting()}
    >
      {children}
      {column.getIsSorted() === 'asc' ? (
        <ArrowUp size={16} />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDown size={16} />
      ) : (
        <ArrowUpDown size={16} />
      )}
    </Box>
  )
}
