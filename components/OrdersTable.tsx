import { selectAddress } from '@/store/slices/account'
import { Order } from '@/types/Order'
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Table,
  TableContainer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, WalletMinimal } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createOrderColumns } from '../utils/tableColumns'
import { ConnectAwareButton } from './shared/ConnectAwareButton'
import { MultiSelectTokenFilter } from './table/MultiSelectTokenFilter'
import { Pagination } from './table/Pagination'
import { TableBody } from './table/TableBody'
import { TableHeader } from './table/TableHeader'
import WithdrawDetailsModal from './Withdraw/WithdrawalDetailModal/WithdrawlDetailsModal'

interface OrdersTableProps {
  data: Order[]
  onCancelOrder: (order: Order) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({ data, onCancelOrder }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedTokens, setSelectedTokens] = React.useState<string[]>([])
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const userAddress = useSelector(selectAddress)

  const handleRowClick = useCallback(
    (order: Order) => {
      setSelectedOrder(order)
      onOpen()
    },
    [onOpen]
  )

  useEffect(() => {
    table.setColumnFilters([
      {
        id: 'offer_token',
        value: selectedTokens,
      },
    ])
  }, [selectedTokens, table])

  return (
    <TableContainer>
      <Flex gap={2} justifyContent={'flex-end'}>
        <MultiSelectTokenFilter selectedTokens={selectedTokens} onChange={setSelectedTokens} />
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} variant="ghost" width={'fit-content'} rightIcon={<ChevronDown />}>
            by Asset Type
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup type="radio" onChange={(value) => table.getColumn('assetType')?.setFilterValue(value)}>
              <MenuItemOption value="fulfilled">Filled</MenuItemOption>
              <MenuItemOption value="pending">Pending</MenuItemOption>
              <MenuItemOption value="cancelled">Cancelled</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} variant="ghost" width={'fit-content'} rightIcon={<ChevronDown />}>
            by Status
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup type="radio">
              <MenuItemOption value="fulfilled">Filled</MenuItemOption>
              <MenuItemOption value="pending">Pending</MenuItemOption>
              <MenuItemOption value="cancelled">Cancelled</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Flex>
      <Table variant="nucleus">
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody rows={table.getRowModel().rows} handleRowClick={handleRowClick} />
      </Table>
      {userAddress && (
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalItems={table.getRowModel().rows.length}
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
