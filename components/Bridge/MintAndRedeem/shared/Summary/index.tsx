import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import { SummaryConnector } from './connector'

function Summary({ fees, loading }: SummaryConnector.Props) {
  return (
    <Flex direction="column" gap={3}>
      <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2} align="center">
          <Text variant="paragraph" color="disabledText">
            Fees
          </Text>
          <Tooltip label="Fees are charged by the underlying bridge provider such as LayerZero">
            <InfoOutlineIcon color="infoIcon" mt={'2px'} fontSize="sm" />
          </Tooltip>
        </Flex>
        <Skeleton w="75px" isLoaded={!loading}>
          <Text textAlign="right" variant="paragraph">
            {fees}
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  )
}

export default SummaryConnector.Connector(Summary)
