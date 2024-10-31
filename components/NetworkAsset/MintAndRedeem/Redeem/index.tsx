import { useRedeem } from '@/hooks/useRedeem'
import { useDispatch, useSelector } from 'react-redux'
import { IonCard } from '@/components/shared/IonCard'
import {
  Button,
  Divider,
  Flex,
  Input,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  ChakraProps,
} from '@chakra-ui/react'
import RedeemSummary from './RedeemSummary'

import ChainSelect from '../shared/ChainSelect'
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
import RedeemSummaryCard from './RedeemSummaryCard'

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
      <ChainSelect role="destination" txType="redeem" isActive={false} />
      <RedeemTokenInput />
      {/* Redeem Input */}
      <ChainSelect role="source" txType="redeem" isActive={true} />
      <RedeemTokenDestination />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button onClick={handleRedeemClick}>Redeem</Button>
    </Flex>
  )
}
