import { Box, Icon } from '@chakra-ui/react'
import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, SwitchVertical01 } from '@untitled-ui/icons-react'
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
        <Icon as={ArrowUp} fontSize={16} />
      ) : column.getIsSorted() === 'desc' ? (
        <Icon as={ArrowDown} fontSize={16} />
      ) : (
        <Icon as={SwitchVertical01} fontSize={16} />
      )}
    </Box>
  )
}
