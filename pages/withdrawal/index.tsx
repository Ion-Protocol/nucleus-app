import { Badge, Flex, Heading, Text } from '@chakra-ui/react'

import OrdersTable from '@/components/OrdersTable'
import { PaginatedResponse } from '@/types/Order'
import { mockOrders } from '@/utils/mockData'
import { ClockArrowUp } from 'lucide-react'
import { useState } from 'react'

export default function Withdrawals() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // In a real application, this would be fetched from an API
  const paginatedData: PaginatedResponse = {
    data: mockOrders,
    pagination: {
      currentPage,
      pageSize,
      totalItems: mockOrders.length,
      totalPages: Math.ceil(mockOrders.length / pageSize),
      hasNextPage: currentPage * pageSize < mockOrders.length,
      hasPreviousPage: currentPage > 1,
    },
  }

  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancelling order ${orderId}`)
    // Cancel logic here modal here maybe
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Fetch the data for the new page here
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
    // Fetch the data with the new page size here
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

      <OrdersTable
        data={paginatedData.data}
        pagination={paginatedData.pagination}
        onCancelOrder={handleCancelOrder}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Flex>
  )
}
