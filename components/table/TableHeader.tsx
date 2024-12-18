import { Order } from '@/types/Order'
import { Th, Thead, Tr } from '@chakra-ui/react'
import { HeaderGroup, flexRender } from '@tanstack/react-table'

interface TableHeaderProps {
  headerGroups: HeaderGroup<Order>[]
}

export function TableHeader({ headerGroups }: TableHeaderProps) {
  return (
    <Thead>
      {headerGroups.map((headerGroup) => (
        // <Tr
        //   key={headerGroup.id}
        //   height={'2.625rem'}
        //   minHeight={'2.625rem'}
        //   borderTop={'1px solid'}
        //   borderTopColor={'border'}
        //   borderBottom={'1px solid'}
        // >
        <Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            // <Th key={header.id} paddingY={1}>
            <Th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
          ))}
        </Tr>
      ))}
    </Thead>
  )
}
