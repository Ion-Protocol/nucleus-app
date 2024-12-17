import { FormattedAmount } from '@/components/table/FormattedAmount'
import { Order } from '@/types/Order'
import { Button } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { AssetPair } from '../components/table/AssetPair'
import { DateCell } from '../components/table/DateCell'
import { SortableHeader } from '../components/table/SortableHeader'
import { StatusBadge } from '../components/table/StatusBadge'

const columnHelper = createColumnHelper<Order>()

export const createOrderColumns = (onCancelOrder: (order: Order) => void) => [
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('offer_token', {
    header: 'Asset',
    cell: (info) => <AssetPair offerToken={info.getValue()} wantToken={info.row.original.want_token} />,
  }),
  columnHelper.accessor('amount', {
    header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
    cell: (info) => <FormattedAmount amount={info.getValue()} />,
  }),
  columnHelper.accessor('deadline', {
    header: ({ column }) => <SortableHeader column={column}>Deadline</SortableHeader>,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor('created_timestamp', {
    header: ({ column }) => <SortableHeader column={column}>Created At</SortableHeader>,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor('ending_timestamp', {
    header: ({ column }) => <SortableHeader column={column}>Filled At</SortableHeader>,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor('id', {
    header: '',
    cell: (info) =>
      info.row.original.status === 'pending' ? (
        <Button
          colorScheme="red"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onCancelOrder(info.row.original)
          }}
        >
          Cancel
        </Button>
      ) : null,
  }),
]
