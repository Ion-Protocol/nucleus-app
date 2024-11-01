import { useRedeem } from '@/hooks/useRedeem'
import { Button, Flex, ChakraProps } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'

interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const handleRedeem = useRedeem()

  return (
    <Flex direction="column" gap={6}>
      {/* Redeem Token Destination */}
      <RedeemTokenInput />
      {/* Redeem Input */}
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button onClick={handleRedeem}>Redeem</Button>
    </Flex>
  )
}
