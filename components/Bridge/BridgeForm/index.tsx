import { ChakraProps, Flex } from '@chakra-ui/react'
import ChainSelect from './ChainSelect'

interface BridgeFormProps extends ChakraProps {}

export function BridgeForm({ ...props }: BridgeFormProps) {
  return (
    <Flex direction="column" {...props}>
      <ChainSelect role="source" />
    </Flex>
  )
}
