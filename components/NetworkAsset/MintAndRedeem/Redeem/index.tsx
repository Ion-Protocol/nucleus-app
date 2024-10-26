import { useDispatch, useSelector } from 'react-redux'
import { setOpen, setSteps, setTitle } from '@/store/slices/stepDialog/slice'
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
import RedeemTokenDestination from './RedeemTokenDestination'
import RedeemTokenInput from './RedeemTokenInput'
interface RedeemProps extends ChakraProps {}

export function Redeem({ ...props }: RedeemProps) {
  const dispatch = useDispatch()
  const dialogState = useSelector((state: any) => state.dialog)

  const handleRedeemClick = () => {
    console.log('Redeem button clicked')
    dispatch(setTitle('Redeem Process'))
    dispatch(
      setSteps([
        { id: '1', description: 'Approve token', state: 'completed' },
        { id: '2', description: 'Redeem ssETH', state: 'active' },
        { id: '3', description: 'Receive ETH', state: 'idle' },
      ])
    )
    dispatch(setOpen(true))

    // Debug: Log the updated state
    console.log('Updated dialog state:', dialogState)
  }

  return (
    <Flex direction="column" gap={6}>
      {/* Redeem Token Destination */}
      <RedeemTokenDestination />
      {/* Redeem Input */}
      <RedeemTokenInput />
      {/* Redeem Summary */}
      <RedeemSummary />
      <Button onClick={handleRedeemClick}>Redeem</Button>
    </Flex>
  )
}
