import { ChakraProps, Divider, Flex } from '@chakra-ui/react'
import ChainSelect from '../shared/ChainSelect'
import Deposit from '../shared/Deposit'
import Summary from '../shared/Summary'
import TokenInput from '../shared/TokenInput'
import TokenDestination from '../shared/TokenDestination'

interface MintProps extends ChakraProps {}

export function Mint({ ...props }: MintProps) {
  return (
    <Flex direction="column" {...props} gap={6}>
      <ChainSelect role="source" isActive={true} />
      <TokenInput />
      <ChainSelect role="destination" isActive={false} />
      <TokenDestination />
      <Summary />
      <Divider />
      <Deposit />
    </Flex>
  )
}
