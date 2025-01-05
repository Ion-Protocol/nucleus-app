import { Box, Flex, Icon, IconProps, Text } from '@chakra-ui/react'
import { CircleX, Hourglass, MailCheck } from 'lucide-react'
import Loader from './Loader'

type StepStatus = 'idle' | 'pending' | 'success' | 'error'

export interface Step {
  title: string
  status: StepStatus
  isIdle?: boolean
  isPending?: boolean
  isCompleted?: boolean
  isError?: boolean
}

interface TxStepsProps {
  steps: Step[]
}

const StepIcons = {
  idle: (props: IconProps) => <Icon as={Hourglass} {...props} />,
  pending: (props: IconProps) => <Loader variant="secondary" {...props} />,
  success: (props: IconProps) => <Icon as={MailCheck} {...props} />,
  error: (props: IconProps) => <Icon as={CircleX} {...props} />,
}

const TxSteps = ({ steps }: TxStepsProps) => {
  const lastStep = steps[steps.length - 1]
  return (
    <Box display="flex" flexDirection="column">
      {steps.map((step) => (
        <Box key={step.title} display="flex" alignItems="center" height={14} gap={4}>
          <Box display="flex" flexDirection="column" alignItems="center" position="relative">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              bg={step.status === 'success' ? 'bg.invert-tertiary' : 'bg.tertiary'}
              padding="4"
              boxSize={2}
            >
              <Icon
                as={StepIcons[step.status]}
                boxSize={5}
                color={step.status === 'success' ? 'element.invert-secondary' : 'element.subdued'}
              />
            </Box>
            {lastStep !== step && (
              <Box
                w="2px"
                h={6}
                top={8}
                position="absolute"
                bg={step.status === 'success' ? 'bg.invert-tertiary' : 'bg.tertiary'}
              />
            )}
          </Box>
          <Flex gap={2} alignItems="center">
            <Text fontFamily="diatype" fontSize="xl" color={'element.main'}>
              {step.title}
            </Text>
          </Flex>
        </Box>
      ))}
    </Box>
  )
}

export default TxSteps
