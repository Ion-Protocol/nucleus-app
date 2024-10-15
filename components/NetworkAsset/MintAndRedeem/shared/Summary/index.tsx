import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'
import { SummaryConnector } from './connector'

function Summary({ fees, loading, isSameChain }: SummaryConnector.Props) {
  const tooltipLabel = isSameChain
    ? 'No fees are charged when depositing and minting on the same chain'
    : 'Fees are charged by the underlying bridge provider such as LayerZero or Hyperlane'
  return (
    <Flex direction="column" gap={3}>
      <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2} align="center">
          <Text variant="paragraph" color="disabledText">
            Fees
          </Text>
          <IonTooltip label={tooltipLabel}>
            <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
          </IonTooltip>
        </Flex>
        <IonSkeleton minW="75px" isLoaded={!loading}>
          <Text textAlign="right" variant="paragraph">
            {fees}
          </Text>
        </IonSkeleton>
      </Flex>
    </Flex>
  )
}

export default SummaryConnector.Connector(Summary)
