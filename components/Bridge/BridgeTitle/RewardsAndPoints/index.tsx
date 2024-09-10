import { ChainIcon } from '@/components/config/chainIcons'
import { MultiIcon } from '@/components/shared/MulitiIcon'
import { Flex, Text, Tooltip } from '@chakra-ui/react'
import { RewardsAndPointsConnector } from './connector'
import { RewardsAndPointsTooltip } from './RewardsAndPointsTooltip'

function RewardsAndPoints({ rewardsAndPointsRows, incentiveChainKeys }: RewardsAndPointsConnector.Props) {
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
        <Text variant="paragraph">Rewards & Points</Text>
      </Flex>
      <Tooltip
        hasArrow
        placement="bottom"
        label={<RewardsAndPointsTooltip rows={rewardsAndPointsRows} />}
        p={0}
        bg="backgroundSecondary"
      >
        <Flex>
          <MultiIcon
            icons={incentiveChainKeys.map((chainKey) => (
              <ChainIcon key={chainKey} chainKey={chainKey} />
            ))}
          />
        </Flex>
      </Tooltip>
    </Flex>
  )
}

export default RewardsAndPointsConnector.Connector(RewardsAndPoints)
