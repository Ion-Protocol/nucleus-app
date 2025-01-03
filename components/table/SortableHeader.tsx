import { Button } from '@chakra-ui/react'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import React from 'react'

interface SortableHeaderProps<T> {
  column: Column<T>
  children: React.ReactNode
}

export function SortableHeader<T>({ column, children }: SortableHeaderProps<T>) {
  return (
    <Button
      variant="ghost"
      _hover={'none'}
      _active={{ bg: 'transparent' }}
      padding={0}
      display={'flex'}
      justifyContent={'flex-start'}
      fontSize={'inherit'}
      color={'inherit'}
      fontWeight={'inherit'}
      onClick={() => column.toggleSorting()}
      marginTop={0}
      rightIcon={
        column.getIsSorted() === 'asc' ? (
          <ArrowUp size={16} />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown size={16} />
        ) : (
          <ArrowUpDown size={16} />
        )
      }
    >
      {children}
    </Button>
  )
}
