import { Box, Flex, Icon, IconProps, Text } from '@chakra-ui/react'
import { QueryStatus } from '@reduxjs/toolkit/query'
import { CircleX, Hourglass, MailCheck } from 'lucide-react'
import Loader from './Loader'

// import { MutationStatus, QueryStatus } from '@tanstack/react-query'

type StepStatus = 'idle' | 'pending' | 'success' | 'error'

export interface Step {
  title: string
  // status?: QueryStatus | MutationStatus
  status?: QueryStatus
  isIdle?: boolean
  isPending?: boolean
  isCompleted?: boolean
  isError?: boolean
}

interface TxStepsProps {
  steps: Step[]
}
// TODO: Use when updating to TanStack Query
// const StepIcons = {
//   idle: (props: IconProps) => <Icon as={Hourglass} {...props} />,
//   pending: (props: IconProps) => <Loader variant="secondary" {...props} />,
//   success: (props: IconProps) => <Icon as={MailCheck} {...props} />,
//   error: (props: IconProps) => <Icon as={CircleX} {...props} />,
// }

const StepIcons = {
  [QueryStatus.uninitialized]: (props: IconProps) => <Icon as={Hourglass} {...props} />,
  [QueryStatus.pending]: (props: IconProps) => <Loader variant="secondary" {...props} />,
  [QueryStatus.fulfilled]: (props: IconProps) => <Icon as={MailCheck} {...props} />,
  [QueryStatus.rejected]: (props: IconProps) => <Icon as={CircleX} {...props} />,
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
              bg={step.status && step.status === QueryStatus.fulfilled ? 'bg.invert-tertiary' : 'bg.tertiary'}
              padding="4"
              boxSize={2}
            >
              <Icon
                as={StepIcons[step.status || QueryStatus.uninitialized]}
                boxSize={5}
                color={
                  step.status && step.status === QueryStatus.fulfilled ? 'element.invert-secondary' : 'element.subdued'
                }
              />
            </Box>
            {lastStep !== step && (
              <Box
                w="2px"
                h={6}
                top={8}
                position="absolute"
                bg={step.status && step.status === QueryStatus.fulfilled ? 'bg.invert-tertiary' : 'bg.tertiary'}
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
