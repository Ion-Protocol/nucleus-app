import { useDispatch, useSelector } from 'react-redux'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Icon,
  Spinner,
  ModalFooter,
  Flex,
  Link,
} from '@chakra-ui/react'
import { RootState } from '@/store'
import { setOpen } from '@/store/slices/stepDialog/slice'
import { CheckIcon, InfoOutlineIcon, ChevronUpIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import WalletIcon from '@/components/shared/icons/wallet.svg'
import RedeemSummaryCard from '../NetworkAsset/MintAndRedeem/Redeem/RedeemSummaryCard'
import { FullErrorIcon } from '../shared/FullErrorIcon'

const StepIcons = {
  idle: ChevronUpIcon,
  active: Spinner,
  completed: CheckIcon,
  error: InfoOutlineIcon,
}

const StepProcessDialog = () => {
  const { steps, title, open, headerContent } = useSelector((state: RootState) => state.dialog)
  const dispatch = useDispatch()
  const lastStep = steps[steps.length - 1]
  const isLastStepCompleted = lastStep?.state === 'completed'

  return (
    <Modal isOpen={open} onClose={() => dispatch(setOpen(false))} isCentered>
      <ModalOverlay />
      <ModalContent bg="neutral.200">
        <ModalHeader fontSize="xl" color="neutral.950" fontWeight={500}>
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {headerContent && (
            <Box paddingBottom={4}>
              {headerContent === 'redeemSummary' && <RedeemSummaryCard />}
              {headerContent === 'error' && <FullErrorIcon />}
            </Box>
          )}
          <Box display="flex" flexDirection="column">
            {steps.map((step) => (
              <Box key={step.id} display="flex" alignItems="center" height={14} gap={4}>
                <Box display="flex" flexDirection="column" alignItems="center" position="relative">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    bg={step.state === 'idle' ? 'neutral.600' : 'neutral.900'}
                    padding="4"
                    boxSize={2}
                  >
                    <Icon as={StepIcons[step.state]} boxSize={5} color={step.state === 'idle' ? 'black' : 'white'} />
                  </Box>
                  {lastStep !== step && (
                    <Box
                      w={1}
                      h={6}
                      top={8}
                      position="absolute"
                      bg={step.state === 'completed' ? 'neutral.900' : 'neutral.600'}
                    />
                  )}
                </Box>
                <Flex gap={2}>
                  <Text fontSize="xl" color={step.state === 'idle' ? 'neutral.600' : 'neutral.900'}>
                    {step.description}
                  </Text>
                  <Link as="span" fontSize="lg" color="neutral.600">
                    <ExternalLinkIcon />
                  </Link>
                </Flex>
                <Box flex={1}>
                  {step.state === 'error' && step.errorMessage && (
                    <Text color="red.500" fontSize="sm">
                      {step.errorMessage}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </ModalBody>
        <ModalFooter flex={1} paddingY={6} justifyContent="center" alignItems="center">
          {isLastStepCompleted ? (
            <Button onClick={() => dispatch(setOpen(false))}>Close</Button>
          ) : (
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="md"
              color="neutral.900"
              gap={2}
              fontWeight={400}
            >
              <WalletIcon color="neutral.600" fill="neutral.700" />
              Please proceed in your wallet
            </Text>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StepProcessDialog
