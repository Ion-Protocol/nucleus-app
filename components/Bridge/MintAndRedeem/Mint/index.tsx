import { ChakraProps, Divider, Flex } from '@chakra-ui/react'
import ChainSelect from '../shared/ChainSelect'
import TokenFrom from '../shared/TokenFrom'
import TokenTo from '../shared/TokenTo'
import Summary from '../shared/Summary'
import Deposit from '../shared/Deposit'
import { IonCard } from '@/components/shared/IonCard'

interface MintProps extends ChakraProps {}

export function Mint({ ...props }: MintProps) {
  return (
    <Flex direction="column" {...props} gap={6}>
      <IonCard variant="outline" gap={5} borderColor="backgroundSecondary">
        <ChainSelect role="source" />
        <TokenFrom />
      </IonCard>
      <TokenTo />
      <Summary />
      <Divider />
      <Deposit />
    </Flex>
  )
}
