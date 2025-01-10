import { MultiSelectFilter } from '@/components/table/multi-select-filter'
import { TableBody } from '@/components/table/table-body'
import { TableHeader } from '@/components/table/table-header'
import { useAppSelector } from '@/store/hooks'
import {
  selectTransactionDataLoading,
  selectTransactionTableData,
  TransactionStatus,
  TransactionTableDataItem,
  TransactionType,
} from '@/store/slices/portfolio/selectors'
import { Button, Flex, Table, TableContainer, useDisclosure } from '@chakra-ui/react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'
import { createTransactionColumns } from './helpers'
import { TransactionDetailsModal } from './TransactionDetailModal'

export const TransactionTable = () => {
  // Hooks
  const transactionTableData = useAppSelector(selectTransactionTableData)
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const isLoading = useAppSelector(selectTransactionDataLoading)

  // State
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<TransactionStatus[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  })
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionTableDataItem | null>(null)

  // Actions
  const handleClearFilters = () => {
    setSelectedTypes([])
    setSelectedStatuses([])
  }

  const handleRowClick = (data: TransactionTableDataItem) => {
    onDetailsOpen()
    setSelectedTransaction(data)
  }

  const handleClose = () => {
    onDetailsClose()
    setSelectedTransaction(null)
  }

  const columns = React.useMemo(() => createTransactionColumns(), [])
  const table = useReactTable({
    debugTable: false,
    data: transactionTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  return (
    <TableContainer>
      <Flex gap={2} justifyContent={'flex-end'} alignItems={'baseline'} pb={3}>
        {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
          <Button
            color="element.subdued"
            variant="link"
            onClick={handleClearFilters}
            fontFamily="diatype"
            fontWeight="normal"
            size="sm"
            fontSize="14px"
            textTransform="uppercase"
          >
            Clear Filters
          </Button>
        )}
        <MultiSelectFilter
          title="by Type"
          selectedValues={selectedTypes}
          onChange={(values: string[]) => setSelectedTypes(values as TransactionType[])}
          options={Object.fromEntries(Object.values(TransactionType).map((type) => [type, type]))}
        />
        <MultiSelectFilter
          title="by Status"
          selectedValues={selectedStatuses}
          onChange={(values: string[]) => setSelectedStatuses(values as TransactionStatus[])}
          options={Object.fromEntries(Object.values(TransactionStatus).map((status) => [status, status]))}
        />
      </Flex>
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody
          rows={table.getRowModel().rows}
          handleRowClick={handleRowClick}
          isLoading={isLoading}
          table={table}
        />
      </Table>
      <TransactionDetailsModal isOpen={isDetailsOpen} onClose={onDetailsClose} transaction={selectedTransaction} />
    </TableContainer>
  )
}
