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
  ModalFooter,
  Flex,
  Link,
} from '@chakra-ui/react'
import { RootState } from '@/store'
import { setOpen } from '@/store/slices/stepDialog/slice'
import { ChevronUp, Check, OctagonX, ExternalLink } from 'lucide-react'
import Loader from '@/components/global/Loader'
import { Icon, IconProps } from '@chakra-ui/react'
import WalletIcon from '@/components/shared/icons/wallet.svg'
import RedeemSummaryCard from '../NetworkAsset/MintAndRedeem/Redeem/RedeemSummaryCard'
import DialogError from './StepProcessDialog/DialogError'
import DialogSuccess from './StepProcessDialog/DialogSuccess'

const StepIcons = {
  idle: (props: IconProps) => <Icon as={ChevronUp} {...props} />,
  active: Loader,
  completed: (props: IconProps) => <Icon as={Check} {...props} />,
  error: (props: IconProps) => <Icon as={OctagonX} {...props} />,
}

const StepProcessDialog = () => {
  const { steps, title, open, headerContent, status } = useSelector((state: RootState) => state.dialog)
  const dispatch = useDispatch()
  const lastStep = steps[steps.length - 1]
  const isLastStepCompleted = lastStep?.state === 'completed'

  return (
    <Modal isOpen={open} onClose={() => dispatch(setOpen(false))} isCentered>
      <ModalOverlay />
      <ModalContent bg="backgroundSecondary">
        <ModalHeader fontSize="xl" color="neutral.950" fontWeight={500}>
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap={4}>
          {status?.type === 'success' && <DialogSuccess />}
          {status?.type === 'error' && <DialogError />}
          {headerContent && headerContent === 'redeemSummary' && <RedeemSummaryCard />}
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
                <Flex gap={2} alignItems="center">
                  <Text fontSize="xl" color={step.state === 'idle' ? 'neutral.600' : 'neutral.900'}>
                    {step.description}
                  </Text>
                  {step.link && (
                    <Link
                      isExternal
                      href={step.link}
                      fontSize="lg"
                      color="neutral.600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink />
                    </Link>
                  )}
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
              fontSize="15px"
              color="neutral.900"
              gap={2}
              fontWeight={400}
            >
              <WalletIcon />
              Please proceed in your wallet
            </Text>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StepProcessDialog
