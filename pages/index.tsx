import { IonConnectButton } from '@/components/IonConnectButton.tsx'
import { useAppSelector } from '@/store/hooks'
import { selectWeEthBalanceError, selectWeEthBalanceLoading, selectWeEthBalanceWithUnit } from '@/store/slices/balance'
import { selectLoading } from '@/store/slices/status'
import { Box, Flex, Skeleton, Text } from '@chakra-ui/react'

export default function Home() {
  const balanceError = useAppSelector(selectWeEthBalanceError)
  const balanceWithUnit = useAppSelector(selectWeEthBalanceWithUnit)
  const loading = useAppSelector(selectLoading)

  return (
    <Box m={10} overflowX="auto">
      <IonConnectButton />

      <Flex mt={6} w="fit-content">
        <Text fontWeight="bold">Balance: </Text>
        <Skeleton isLoaded={!loading} ml={3}>
          <Text>{balanceWithUnit}</Text>
        </Skeleton>
      </Flex>
      {balanceError && <Text color="error.main">{balanceError}</Text>}
      <Box h="2000px">Hello World</Box>
    </Box>
  )
}
