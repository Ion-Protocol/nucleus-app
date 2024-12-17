import { Badge, Flex, Heading, Select, Text, useDisclosure } from '@chakra-ui/react'

import OrdersTable from '@/components/OrdersTable'
import CancelWithdrawDialog from '@/components/Withdraw/CancelWithdrawDialog/CancelWithdrawDialog'
import { selectAddress } from '@/store/slices/account'
import { useWithdrawalOrdersByUserQuery } from '@/store/slices/nucleusBackendApi'
import { Order, OrderStatus, PaginatedResponse } from '@/types/Order'
import { Row } from '@tanstack/react-table'
import { ClockArrowUp } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function Withdrawals() {
  const userAddress = useSelector(selectAddress)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')
  const {
    data: orders,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useWithdrawalOrdersByUserQuery(
    {
      user: userAddress!,
      page: currentPage,
      limit: pageSize,
      status: status,
    },
    {
      skip: !userAddress,
    }
  )

  const paginatedData: PaginatedResponse = {
    data: orders?.data || [],
    pagination: orders?.pagination || {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  }

  const handleCancelOrder = (order: Order) => {
    setSelectedOrderToCancel(order)
    onOpen()
  }

  const handleRowClick = (row: Row<Order>) => {
    console.log(row)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }
  return (
    <Flex p={9} direction="column" pb="150px">
      <Heading as={'h1'}>Withdrawal</Heading>
      <Flex>
        <Badge display={'flex'} alignItems={'center'} paddingX={2} paddingY={1} gap={1}>
          <ClockArrowUp size={18} />
          <Text fontSize={'small'}>Withdrawal Activity</Text>
        </Badge>
      </Flex>
      <Flex>
        <Select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="fulfilled">fulfilled</option>
          <option value="cancelled">cancelled</option>
        </Select>
      </Flex>
      <OrdersTable
        data={paginatedData.data}
        pagination={paginatedData.pagination}
        onCancelOrder={handleCancelOrder}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <CancelWithdrawDialog isOpen={isOpen} onClose={onClose} order={selectedOrderToCancel} />
    </Flex>
  )
}
