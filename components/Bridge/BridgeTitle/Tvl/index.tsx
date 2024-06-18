import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Text, Tooltip } from '@chakra-ui/react'
import { TvlConnector } from './connector'

function Tvl({ tvlFormatted, loading }: TvlConnector.Props) {
  return (
    <Flex border="1px solid" borderColor="border" borderRadius="5px" p={3} direction="column" gap={2}>
      <Flex gap={2} align="center">
        <Text variant="large">Total Value Locked</Text>
        <Tooltip label="Lorem ipsum dolor sit amet, consectetur adipiscing.">
          <InfoOutlineIcon color="neutral.600" />
        </Tooltip>
      </Flex>
      <Text variant="xxl">{tvlFormatted}</Text>
    </Flex>
  )
}

export default TvlConnector.Connector(Tvl)
