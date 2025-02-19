import { Badge, Flex, Heading } from '@chakra-ui/react'

import OrdersTable from '@/components/orders-table'
import { selectAddress } from '@/store/slices/account'
import { useWithdrawalOrdersByUserQuery } from '@/store/slices/nucleusBackendApi'
import { ClockArrowUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

export default function Withdrawals() {
  const userAddress = useSelector(selectAddress)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const {
    data: orders,
    refetch,
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
      pollingInterval: 2000,
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    }
  )

  const filteredData = useMemo(() => {
    return orders ? orders.filter((row) => Number(row.amount) !== 0) : []
  }, [orders])

  return (
    <Flex p={8} direction="column" pb="150px" bg={'bg.white'}>
      {/* TODO: Heading styles should be in the theme */}
      <Flex direction={'column'} gap={6}>
        <Heading as={'h1'} fontFamily={'ppformula'} fontSize={'1.5rem'} fontWeight={'medium'}>
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
      <OrdersTable data={filteredData} refetch={refetch} isLoading={isLoading} isError={isError} />
    </Flex>
  )
}
