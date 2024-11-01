import { useRedeem } from '@/hooks/useRedeem'
import { Button, Flex, ChakraProps } from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
import ChainSelect from '../shared/ChainSelect'
import RedeemChainSelect from './RedeemChainSelect'
import { selectAddress } from '@/store/slices/account'
import { useSelector } from 'react-redux'
interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const handleRedeem = useRedeem()
  const address = useSelector(selectAddress)

  return (
    <Flex direction="column" gap={6}>
      {/* Redeem Token Destination */}
      <RedeemChainSelect role="source" isActive={false} />
      <RedeemTokenInput />
      {/* Redeem Input */}
      <RedeemChainSelect role="destination" isActive={true} />
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button disabled={!address} onClick={handleRedeem}>
        Redeem
      </Button>
    </Flex>
  )
}
