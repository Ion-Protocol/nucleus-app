import {
  Badge,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  useDisclosure,
} from '@chakra-ui/react'

import OrdersTable from '@/components/OrdersTable'
import CancelWithdrawDialog from '@/components/Withdraw/CancelWithdrawDialog/CancelWithdrawDialog'
import { selectAddress } from '@/store/slices/account'
import { useWithdrawalOrdersByUserQuery } from '@/store/slices/nucleusBackendApi'
import { Order, OrderStatus, PaginatedResponse } from '@/types/Order'
import { Row } from '@tanstack/react-table'
import { ChevronDown, ClockArrowUp } from 'lucide-react'
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
    <Flex p={9} direction="column" pb="150px" bg={'white'}>
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
          fontFamily={'var(--font-ppformula)'}
          fontWeight={'normal'}
          lineHeight={'1.125rem'}
          textTransform={'none'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          paddingX={2}
          paddingY={1}
          gap={1}
          bg={'backgroundSecondary'}
          borderRadius={'.5rem'}
          width={'fit-content'}
        >
          <ClockArrowUp size={18} strokeWidth={1.75} />
          Withdrawal Activity
        </Badge>
      </Flex>
      <Flex justifyContent={'flex-end'}>
        <Select width={'8rem'} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
          <option value="all">by Status</option>
          <option value="fulfilled">fulfilled</option>
          <option value="pending">pending</option>
          <option value="cancelled">cancelled</option>
        </Select>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} variant="ghost" rightIcon={<ChevronDown />}>
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
