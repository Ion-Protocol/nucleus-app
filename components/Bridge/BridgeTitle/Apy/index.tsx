import { Flex, Text } from '@chakra-ui/react'
import { ApyConnector } from './connector'
import { IonSkeleton } from '@/components/shared/IonSkeleton'

function Apy({ netApy, loading }: ApyConnector.Props) {
  return (
    <Flex
      border="1px solid"
      borderColor="border"
      borderRadius="8px"
      py={6}
      px={6}
      direction="column"
      gap={3}
      align="center"
      w="100%"
    >
      <Text variant="paragraph">APY</Text>
      <IonSkeleton isLoaded={!loading}>
        <Text variant="bigNumbers">{netApy}</Text>
      </IonSkeleton>
    </Flex>
  )
}

export default ApyConnector.Connector(Apy)
