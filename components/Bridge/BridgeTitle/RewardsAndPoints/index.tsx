import { Flex, Text } from '@chakra-ui/react'
import { useAppSelector } from '@/store/hooks'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import RewardsIconRow from '@/components/shared/RewardsAndPoints/RewardsIconRow'
import RewardsTooltip from '@/components/shared/RewardsAndPoints/RewardsTooltip'
import { InfoOutlineIcon } from '@chakra-ui/icons'

function RewardsAndPoints() {
  const chainKey = useAppSelector(selectChainKeyFromRoute)

  return (
    <RewardsTooltip chainKey={chainKey}>
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
            Rewards & Points
          </Text>
          <InfoOutlineIcon color="infoIcon" />
        </Flex>
        <RewardsIconRow chainKey={chainKey} />
      </Flex>
    </RewardsTooltip>
  )
}

export default RewardsAndPoints
