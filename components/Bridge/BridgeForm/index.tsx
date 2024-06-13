import { ChakraProps, Divider, Flex } from '@chakra-ui/react'
import ChainSelect from './ChainSelect'
import TokenFrom from './TokenFrom'
import TokenTo from './TokenTo'

interface BridgeFormProps extends ChakraProps {}

export function BridgeForm({ ...props }: BridgeFormProps) {
  return (
    <Flex direction="column" {...props} gap={6}>
      <ChainSelect role="source" />
      <TokenFrom />
      <Divider />
      <ChainSelect role="destination" />
      <TokenTo />
    </Flex>
  )
}
