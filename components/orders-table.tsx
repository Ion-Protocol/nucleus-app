import { selectAddress } from '@/store/slices/account'
import { Order } from '@/types/Order'
import { Button, Flex, Table, TableContainer, Text, useDisclosure } from '@chakra-ui/react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { WalletMinimal } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Address } from 'viem'
import { createOrderColumns } from '../utils/tableColumns'
import { ConnectAwareButton } from './shared/ConnectAwareButton'
import { MultiSelectFilter } from './table/MultiSelectFilter'
import { Pagination } from './table/Pagination'
import { TableBody } from './table/TableBody'
import { TableHeader } from './table/TableHeader'
import WithdrawDetailsModal from './Withdraw/WithdrawalDetailModal/withdraw-detail-modal'

const tokenValues: Address[] = [
  '0xA8A3A5013104e093245164eA56588DBE10a3Eb48',
  '0x6C587402dC88Ef187670F744dFB9d6a09Ff7fd76',
  '0x5d82Ac302C64B229dC94f866FD10EC6CcF8d47A2',
  '0x196ead472583bc1e9af7a05f860d9857e1bd3dcc',
  '0x9Ed15383940CC380fAEF0a75edacE507cC775f22',
  '0x19e099B7aEd41FA52718D780dDA74678113C0b32',
]
interface OrdersTableProps {
  data: Order[]
  onCancelOrder: (order: Order) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data, onCancelOrder }) => {
  const [selectedTokens, setSelectedTokens] = React.useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const columns = React.useMemo(() => createOrderColumns(onCancelOrder), [onCancelOrder])
  const table = useReactTable({
    debugTable: true,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const userAddress = useSelector(selectAddress)

  const handleRowClick = useCallback(
    (order: Order) => {
      setSelectedOrder(order)
      onOpen()
    },
    [onOpen]
  )

  const handleClearFilters = () => {
    setSelectedTokens([])
    setSelectedStatus([])
  }

  useEffect(() => {
    table.setColumnFilters([
      {
        id: 'offer_token',
        value: selectedTokens,
      },
      {
        id: 'status',
        value: selectedStatus,
      },
    ])
  }, [selectedTokens, selectedStatus, table])

  return (
    <TableContainer>
      <Flex gap={2} justifyContent={'flex-end'} alignItems={'baseline'} pb={3}>
        {/* <MultiSelectTokenFilter selectedTokens={selectedTokens} onChange={setSelectedTokens} /> */}
        {(selectedTokens.length > 0 || selectedStatus.length > 0) && (
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
          title="By Asset Type"
          onChange={setSelectedTokens}
          options={tokenValues}
          isAssetFilter={true}
        />
        <MultiSelectFilter
          title="By Status"
          onChange={setSelectedStatus}
          options={['fulfilled', 'pending', 'cancelled']}
        />
      </Flex>
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} handleRowClick={handleRowClick} />
      </Table>
      {userAddress && (
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          pageItems={table.getRowModel().rows.length.toLocaleString()}
          totalItems={table.getRowCount().toLocaleString()}
          totalPages={table.getPageCount()}
          onNextPage={() => table.nextPage()}
          onPreviousPage={() => table.previousPage()}
          hasNextPage={!table.getCanNextPage()}
          hasPreviousPage={!table.getCanPreviousPage()}
        />
      )}
      {!userAddress && (
        <Flex justifyContent={'center'} height={'10rem'}>
          <Flex direction={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
            <Text>Your wallet is not connected</Text>
            <ConnectAwareButton leftIcon={<WalletMinimal />} variant={'outline'} />
          </Flex>
        </Flex>
      )}
      <WithdrawDetailsModal isOpen={isOpen} onClose={onClose} order={selectedOrder} />
    </TableContainer>
  )
}

export default OrdersTable
