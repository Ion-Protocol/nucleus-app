import { FormattedAmount } from '@/components/table/FormattedAmount'
import { SortableHeader } from '@/components/table/SortableHeader'
import { Order } from '@/types/Order'
import { Box, Button } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { AssetPair } from '../components/table/AssetPair'
import { DateCell } from '../components/table/DateCell'
import { StatusBadge } from '../components/table/StatusBadge'

const columnHelper = createColumnHelper<Order>()

export const createOrderColumns = (onCancelOrder: (order: Order) => void) => [
  columnHelper.accessor('status', {
    header: 'Status',
    filterFn: 'arrIncludesSome',
    cell: (info) => <StatusBadge status={Number(info.row.original.amount) === 0 ? 'cancelled' : info.getValue()} />,
  }),
  columnHelper.accessor('offer_token', {
    header: 'Asset',
    filterFn: 'arrIncludesSome',
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
    cell: (info) => <DateCell showLeftArrow={true} date={info.getValue()} />,
  }),
  columnHelper.accessor('id', {
    header: '',
    cell: (info) =>
      info.row.original.status === 'pending' ? (
        // TODO: V2 theme rollout - remove custom style overrides
        <Button
          fontFamily="diatype"
          variant="outline"
          fontWeight="normal"
          bg="white"
          border="1px solid"
          borderColor="neutral.600"
          width="90px"
          px={3}
          py={4}
          iconSpacing={1}
          size="sm"
          leftIcon={<X size={16} strokeWidth={1.5} />}
          onClick={(e) => {
            e.stopPropagation()
            onCancelOrder(info.row.original)
          }}
        >
          Cancel
        </Button>
      ) : (
        <Box width="90px" />
      ),
  }),
]