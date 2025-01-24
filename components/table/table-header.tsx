import { Th, Thead, Tr } from '@chakra-ui/react'
import { HeaderGroup, flexRender } from '@tanstack/react-table'

interface TableHeaderProps {
  headerGroups: HeaderGroup<any>[]
  bg?: string
}

export function TableHeader({ headerGroups, bg }: TableHeaderProps) {
  return (
    <Thead>
      {headerGroups.map((headerGroup) => (
        <Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Th key={header.id} textAlign="left" pl={3} bg={bg}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Th>
          ))}
        </Tr>
      ))}
    </Thead>
  )
}
