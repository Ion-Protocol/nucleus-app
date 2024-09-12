import { ChainIcon } from '@/components/config/chainIcons'
import { MultiIcon } from '@/components/shared/MulitiIcon'
import { Flex, Tooltip } from '@chakra-ui/react'
import { RewardsIconRowConnector } from './connector'
import { RewardsAndPointsTooltipLabel } from './RewardsAndPointsTooltipLabel'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { PointSystemIcon } from '@/components/config/pointSystemIcons'

function RewardsIconRow({
  rewardsAndPointsRows,
  incentiveChainKeys,
  pointSystemKeys,
  chainKey,
  ...props
}: RewardsIconRowConnector.Props) {
  return (
    <Tooltip
      offset={[0, 18]}
      placement="bottom"
      label={<RewardsAndPointsTooltipLabel rows={rewardsAndPointsRows} />}
      p={0}
      bg="backgroundSecondary"
      borderRadius="8px"
      boxShadow="none"
      border="1px solid"
      borderColor="border"
    >
      <Flex align="center" {...props}>
        <MultiIcon
          icons={incentiveChainKeys
            .map((incentiveChainKey) => <ChainIcon key={incentiveChainKey} chainKey={incentiveChainKey} />)
            .concat(
              pointSystemKeys.map((pointSystemKey) => (
                <PointSystemIcon key={pointSystemKey} pointSystemKey={pointSystemKey} />
              ))
            )}
        />
        <InfoOutlineIcon color="infoIcon" h="13px" ml="-4px" />
      </Flex>
    </Tooltip>
  )
}

export default RewardsIconRowConnector.Connector(RewardsIconRow)
