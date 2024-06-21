import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import { TvlConnector } from './connector'

function Tvl({ tvlFormatted, loading }: TvlConnector.Props) {
  return (
    <Flex border="1px solid" borderColor="border" borderRadius="5px" py={2} px={3} direction="column" gap={2}>
      <Flex gap={2} align="center">
        <Text variant="large">Total Value Locked</Text>
        <Tooltip label="Total value of assets backing the native yield asset.">
          <InfoOutlineIcon color="neutral.600" />
        </Tooltip>
      </Flex>
      <Skeleton isLoaded={!loading}>
        <Text variant="xxl">{tvlFormatted}</Text>
      </Skeleton>
    </Flex>
  )
}

export default TvlConnector.Connector(Tvl)
