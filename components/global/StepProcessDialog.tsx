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
} from '@chakra-ui/react'
import { RootState } from '@/store'
import { setOpen } from '@/store/slices/stepDialog/slice'
import { CheckIcon, WarningIcon, ChevronUpIcon } from '@chakra-ui/icons'

const StepIcons = {
  idle: ChevronUpIcon,
  active: Spinner,
  completed: CheckIcon,
  error: WarningIcon,
}

const StepProcessDialog = () => {
  const { steps, title, open, extraContent } = useSelector((state: RootState) => state.dialog)
  const dispatch = useDispatch()
  const lastStep = steps[steps.length - 1]
  const isLastStepCompleted = lastStep?.state === 'completed'

  return (
    <Modal isOpen={open} onClose={() => dispatch(setOpen(false))} isCentered>
      <ModalOverlay />
      <ModalContent bg="neutral.200">
        <ModalHeader fontWeight={500}>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {extraContent && <Box paddingBottom={4}>{extraContent}</Box>}
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
                <Text fontSize="xl" color={step.state === 'idle' ? 'neutral.600' : 'neutral.900'}>
                  {step.description}
                </Text>
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
        <ModalFooter flex={1} justifyContent="center" alignItems="center">
          {isLastStepCompleted ? (
            <Button>Close</Button>
          ) : (
            <Text fontSize="md" fontWeight={400}>
              Please proceed in your wallet
            </Text>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StepProcessDialog
