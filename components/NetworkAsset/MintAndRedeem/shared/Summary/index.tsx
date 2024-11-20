import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'
import { SummaryConnector } from './connector'

function Summary({
  sourceTokenName,
  fees,
  loading,
  isSameChain,
  exchangeRate,
  truncatedExchangeRate,
  exchangeRateLoading,
  networkAssetName,
}: SummaryConnector.Props) {
  const tooltipLabel = isSameChain
    ? 'No fees are charged when depositing and minting on the same chain'
    : 'Fees are charged by the underlying bridge provider such as LayerZero or Hyperlane'
  const exchangeRateTooltipLabel = 'The exchange rate is the ratio of the deposit amount to the minted amount.'
  return (
    <Flex direction="column" gap={3}>
      <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2} align="center">
          <Text variant="paragraph" color="disabledText">
            Exchange Rate
          </Text>
          <IonTooltip label={exchangeRateTooltipLabel}>
            <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
          </IonTooltip>
        </Flex>
        <IonSkeleton minW="35px" isLoaded={!exchangeRateLoading}>
          <IonTooltip label={exchangeRate}>
            <Text textAlign="right" variant="paragraph">
              {`${truncatedExchangeRate} ${sourceTokenName} / ${networkAssetName}`}
            </Text>
          </IonTooltip>
        </IonSkeleton>
      </Flex>
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
