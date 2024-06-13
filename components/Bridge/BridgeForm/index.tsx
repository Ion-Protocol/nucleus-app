import { Text, Button, ChakraProps, Divider, Flex } from '@chakra-ui/react'
import ChainSelect from './ChainSelect'
import TokenFrom from './TokenFrom'
import TokenTo from './TokenTo'
import { selectBridgeDestinationChain, selectBridgeSourceChain } from '@/store/slices/bridges'
import { useAppSelector } from '@/store/hooks'
import Submit from './Submit'

interface BridgeFormProps extends ChakraProps {}

export function BridgeForm({ ...props }: BridgeFormProps) {
  const sourceChain = useAppSelector(selectBridgeSourceChain)
  const destinationChain = useAppSelector(selectBridgeDestinationChain)

  function handleSubmit() {
    //
  }

  return (
    <Flex direction="column" {...props} gap={6}>
      <ChainSelect role="source" />
      <TokenFrom />
      <Divider />
      <ChainSelect role="destination" />
      <TokenTo />
      <Divider />
      {sourceChain === destinationChain && (
        <Text fontSize="sm" color="secondaryText">
          Source chain and destination chain are the same. Your tokens will be minted but not bridged.
        </Text>
      )}
      <Submit />
    </Flex>
  )
}
