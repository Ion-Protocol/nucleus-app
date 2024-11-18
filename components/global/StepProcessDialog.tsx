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
import { clearCompletedSteps, setOpen, setStatus, resetDialog } from '@/store/slices/stepDialog/slice'
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

  const handleCloseDialog = () => {
    dispatch(resetDialog())
  }

  return (
    <Modal isOpen={open} onClose={handleCloseDialog} isCentered>
      <ModalOverlay />
      <ModalContent bg="backgroundSecondary">
        <ModalHeader fontSize="22px" color="neutral.950" fontWeight={400} paddingX={12} paddingTop={8}>
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap={4} paddingBottom={0} paddingX={'50px'}>
          {/* <DialogSuccess /> */}
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
                    bg={step.state === 'idle' ? 'dialogSteps.idle' : 'dialogSteps.active'}
                    padding="4"
                    boxSize={2}
                  >
                    <Icon
                      as={StepIcons[step.state]}
                      boxSize={5}
                      color={step.state === 'idle' ? 'dialogSteps.icon.idle' : 'dialogSteps.icon.active'}
                    />
                  </Box>
                  {lastStep !== step && (
                    <Box
                      w={1}
                      h={6}
                      top={8}
                      position="absolute"
                      bg={step.state === 'completed' ? 'dialogSteps.active' : 'dialogSteps.idle'}
                    />
                  )}
                </Box>
                <Flex gap={2} alignItems="center">
                  <Text fontSize="22px" fontWeight={400} color={step.state === 'idle' ? 'textSecondary' : 'text'}>
                    {step.description}
                  </Text>
                  {step.link && (
                    <Link
                      isExternal
                      href={step.link}
                      fontSize="lg"
                      color="text"
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
        <ModalFooter flex={1} paddingBottom={8} justifyContent="center" alignItems="center" paddingX={12}>
          {isLastStepCompleted ? (
            <Button width={'100%'} onClick={handleCloseDialog}>
              Close
            </Button>
          ) : (
            <Text
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="15px"
              color="tooltipLabel"
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
