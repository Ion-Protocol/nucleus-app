import { ChakraProps, Flex } from '@chakra-ui/react'

interface BridgeFormProps extends ChakraProps {}

export function BridgeForm({ ...props }: BridgeFormProps) {
  return (
    <Flex direction="column" {...props}>
      Bridge Form
    </Flex>
  )
}
