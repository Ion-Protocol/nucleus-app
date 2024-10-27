import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Icon,
  Spinner,
  ModalFooter,
  Flex,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setOpen } from '@/store/slices/stepDialog/slice'
import { CheckIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons'

const StepIcons = {
  idle: TimeIcon,
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
          {extraContent && <Box mt={4}>{extraContent}</Box>}
          <VStack align="stretch" spacing={4}>
            {steps.map((step) => (
              <Box key={step.id}>
                <Box display="flex" alignItems="center">
                  <Icon as={StepIcons[step.state]} boxSize={6} mr={2} />
                  <Text>{step.description}</Text>
                </Box>
                {step.state === 'error' && step.errorMessage && (
                  <Text color="red.500" fontSize="sm">
                    {step.errorMessage}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
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
