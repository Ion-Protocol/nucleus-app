import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Text } from '@chakra-ui/react'
import { TvlConnector } from './connector'

function Tvl({ tvlFormatted, loading }: TvlConnector.Props) {
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
      <Flex gap={2} align="center">
        <Text variant="paragraph" whiteSpace="nowrap">
          Total Value Locked
        </Text>
        <IonTooltip label="Total value of assets backing the native yield asset.">
          <InfoOutlineIcon color="infoIcon" />
        </IonTooltip>
      </Flex>
      <IonSkeleton w="150px" isLoaded={!loading}>
        <Text textAlign="center" variant="bigNumbers">
          {tvlFormatted}
        </Text>
      </IonSkeleton>
    </Flex>
  )
}

export default TvlConnector.Connector(Tvl)
