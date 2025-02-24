import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { Flex, Text } from '@chakra-ui/react'
import { ApyConnector } from './connector'

function Apy({
  formattedNetApy,
  fullFormattedNetApy,
  loading,
  shouldShowMessageForLargeNetApy,
  apy,
}: ApyConnector.Props) {
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
      bg="backgroundSecondary"
    >
      <Text variant="paragraph">APY</Text>
      <IonSkeleton isLoaded={!loading}>
        <IonTooltip
          label={shouldShowMessageForLargeNetApy ? `${fullFormattedNetApy} will likely decrease...` : undefined}
        >
          <Text variant="bigNumbers">{apy ? apy : formattedNetApy}</Text>
        </IonTooltip>
      </IonSkeleton>
    </Flex>
  )
}

export default ApyConnector.Connector(Apy)
