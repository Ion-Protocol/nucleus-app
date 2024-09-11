import { ChainIcon } from '@/components/config/chainIcons'
import { MultiIcon } from '@/components/shared/MulitiIcon'
import { Flex, Tooltip } from '@chakra-ui/react'
import { RewardsIconRowConnector } from './connector'
import { RewardsAndPointsTooltipLabel } from './RewardsAndPointsTooltipLabel'

function RewardsIconRow({
  rewardsAndPointsRows,
  incentiveChainKeys,
  chainKey,
  ...props
}: RewardsIconRowConnector.Props) {
  return (
    <Tooltip
      offset={[0, 18]}
      hasArrow
      placement="bottom"
      label={<RewardsAndPointsTooltipLabel rows={rewardsAndPointsRows} />}
      p={0}
      bg="backgroundSecondary"
      borderRadius="8px"
      boxShadow="none"
      border="1px solid"
      borderColor="border"
      sx={{
        '.chakra-tooltip__arrow-wrapper .chakra-tooltip__arrow': {
          mt: '-2px',
          borderTop: '1px solid',
          borderLeft: '1px solid',
          borderColor: 'border',
        },
      }}
    >
      <Flex {...props}>
        <MultiIcon
          icons={incentiveChainKeys.map((incentiveChainKey) => (
            <ChainIcon key={incentiveChainKey} chainKey={incentiveChainKey} />
          ))}
        />
      </Flex>
    </Tooltip>
  )
}

export default RewardsIconRowConnector.Connector(RewardsIconRow)
