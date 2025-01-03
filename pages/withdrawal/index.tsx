import { Badge, Flex, Heading, useDisclosure } from '@chakra-ui/react'

import OrdersTable from '@/components/OrdersTable'
import CancelWithdrawDialog from '@/components/Withdraw/CancelWithdrawDialog/CancelWithdrawDialog'
import { selectAddress } from '@/store/slices/account'
import { useWithdrawalOrdersByUserQuery } from '@/store/slices/nucleusBackendApi'
import { Order, OrderStatus } from '@/types/Order'
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
    },
    {
      skip: !userAddress,
    }
  )
  console.table(orders)

  const handleCancelOrder = (order: Order) => {
    setSelectedOrderToCancel(order)
    onOpen()
  }

  return (
    <Flex p={9} direction="column" pb="150px" bg={'bg.white'}>
      {/* TODO: Heading styles should be in the theme */}
      <Flex direction={'column'} gap={6}>
        <Heading as={'h1'} fontFamily={'var(--font-ppformula)'} fontSize={'1.5rem'} fontWeight={'medium'}>
          Withdrawal
        </Heading>
        {/* ! Need to update to tabs when other tab is added. It doesn't make sense right now*/}
        {/* <Tabs variant="soft-rounded" size={'sm'}>
          <Tab
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={1}
            fontFamily={'var(--font-ppformula)'}
            borderRadius={'.5rem'}
            fontWeight={'normal'}
            lineHeight={'1.125rem'}
            isDisabled={true}
          >
            <ClockArrowUp size={18} />
            Withdrawal Activity
          </Tab>
        </Tabs> */}
        <Badge
          fontSize={'small'}
          fontFamily="diatype"
          fontWeight={'normal'}
          lineHeight={'1.125rem'}
          textTransform={'none'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          paddingX={2}
          paddingY={1}
          gap={1}
          bg={'bg.secondary'}
          color={'element.lighter'}
          borderRadius={'.5rem'}
          width={'fit-content'}
        >
          <ClockArrowUp size={18} strokeWidth={1.75} />
          Withdrawal Activity
        </Badge>
      </Flex>
      <OrdersTable data={orders || []} onCancelOrder={handleCancelOrder} />
      <CancelWithdrawDialog isOpen={isOpen} onClose={onClose} order={selectedOrderToCancel} />
    </Flex>
  )
}
