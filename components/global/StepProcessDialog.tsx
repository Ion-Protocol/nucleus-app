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
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {steps.map((step) => (
              <Box key={step.id} borderLeft="2px solid gray" pl={4}>
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
          {extraContent && <Box mt={4}>{extraContent}</Box>}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StepProcessDialog
