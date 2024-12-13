import { Flex } from '@chakra-ui/react'

import OrdersTable from '@/components/OrdersTable'
import { mockOrders } from '@/utils/mockData'

export default function Withdrawals() {
  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancelling order ${orderId}`)
    // Implement your cancel logic here
  }
  return (
    <Flex p={9} pr={3} direction="column" pb="150px">
      Withdrawals
      <OrdersTable data={mockOrders} onCancelOrder={handleCancelOrder} />
    </Flex>
  )
}
