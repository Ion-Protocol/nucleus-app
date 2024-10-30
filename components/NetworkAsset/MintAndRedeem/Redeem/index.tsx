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
import RedeemSummaryCard from './RedeemSummaryCard'
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
import ChainSelect from '../shared/ChainSelect'
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
      <RedeemTokenDestination />
      {/* Redeem Input */}
      <ChainSelect role="source" txType="redeem" isActive={true} />
      <RedeemTokenInput />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button onClick={handleRedeemClick}>Redeem</Button>
    </Flex>
  )
}
