import { useRedeem } from '@/hooks/useRedeem'
import { Button, Flex, ChakraProps } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import ChainSelect from '../shared/ChainSelect'
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
import { useSelector } from 'react-redux'

interface RedeemProps extends ChakraProps {}

const data = {
  redeemAmount: '4 ssETH',
  receiveAmount: '2 ETH',
  bridgeFee: '-0.05 ETH',
  deadline: '3 days',
  withdrawFee: '0.05 ETH',
}

export function Redeem({ ...props }: RedeemProps) {
  const { handleRedeem } = useRedeem()

  const handleRedeemClick = () => {
    handleRedeem(data)
  }

  return (
    <Flex direction="column" gap={6}>
      {/* Redeem Token Destination */}
      <RedeemTokenInput />
      {/* Redeem Input */}
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button onClick={handleRedeemClick}>Redeem</Button>
    </Flex>
  )
}
