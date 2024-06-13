import { ChakraProps, Flex } from '@chakra-ui/react'
import ChainSelect from './ChainSelect'
import TokenInput from './TokenInput'

interface BridgeFormProps extends ChakraProps {}

export function BridgeForm({ ...props }: BridgeFormProps) {
  return (
    <Flex direction="column" {...props} gap={6}>
      <ChainSelect role="source" />
      <TokenInput role="from" />
    </Flex>
  )
}
