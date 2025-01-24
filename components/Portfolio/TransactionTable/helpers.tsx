import { TransactionTableDataItem } from '@/store/slices/portfolio/selectors'
import { createColumnHelper } from '@tanstack/react-table'
import { Skeleton, Text } from '@chakra-ui/react'
import { StatusBadge } from '@/components/table/status-badge'
import { ActivityCell } from './ActivityCell'
import { ActionCell } from '../AssetsTable/ActionCell'
import { SortableHeader } from '@/components/table/sortable-header'

const columnHelper = createColumnHelper<TransactionTableDataItem>()

export function createTransactionColumns(isLoading?: boolean) {
  return [
    columnHelper.accessor('status', {
      header: 'Status',
      filterFn: 'arrIncludesSome',
      cell: (info) => (
        <StatusBadge status={Number(info.row.original.sourceAmount) === 0 ? 'cancelled' : info.getValue()} />
      ),
    }),
    columnHelper.accessor('table.type', {
      header: 'Type',
      filterFn: 'arrIncludesSome',
      cell: (info) => (
        <Text variant="body-16" color="element.main">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('table', {
      header: 'Activity',
      cell: (info) => <ActivityCell {...info} />,
    }),
    columnHelper.accessor('table.date', {
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
      cell: (info) => (
        <Text variant="body-16" color="element.main">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        !isLoading ? (
          <ActionCell handleMintMore={() => {}} handleWithdraw={() => {}} row={row} />
        ) : (
          <Skeleton
            w="60px"
            h="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        ),
    }),
  ]
}
