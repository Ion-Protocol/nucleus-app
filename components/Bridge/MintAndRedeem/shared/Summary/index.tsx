import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import { SummaryConnector } from './connector'

function Summary({ fees, loading }: SummaryConnector.Props) {
  return (
    <Flex direction="column" gap={3}>
      <Text variant="large" fontWeight="bold">
        Summary
      </Text>
      <Flex align="center" justify="space-between">
        <Flex color="secondaryText" gap={2}>
          <Text variant="large">Fees</Text>
          <Tooltip label="Fees are charged by the underlying bridge provider such as LayerZero">
            <InfoOutlineIcon mt={'2px'} fontSize="sm" />
          </Tooltip>
        </Flex>
        <Skeleton w="75px" isLoaded={!loading}>
          <Text textAlign="right" variant="large">
            {fees}
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  )
}

export default SummaryConnector.Connector(Summary)
