import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { TokenIcon } from '@/components/config/tokenIcons'
import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import { Divider, Flex, Link, Text } from '@chakra-ui/react'
import { RewardsTooltipContentConnector } from './connector'
import { IonTooltip } from '../../IonTooltip'

export function RewardsTooltipContent({
  defaultYieldAssetKey,
  defaultYieldAssetName,
  defaultYieldAssetPercent,
  tokenIncentives,
  rewards,
  netApy,
  fullFormattedNetApy,
  shouldShowMessageForLargeNetApy,
}: RewardsTooltipContentConnector.Props) {
  return (
    <Flex direction="column" p={3} gap={3}>
      <Flex align="center" gap={2}>
        <InfoIcon color="text" fontSize="12px" />
        <Text variant="smallParagraph" color="text">
          This vault earns additional incentives
        </Text>
      </Flex>

      {/* Default Yield */}
      <Flex direction="column">
        <Text variant="smallParagraph" color="tooltipLabel">
          Default Yield
        </Text>
        <Flex align="center" justify="space-between" mt={1}>
          <Flex gap={2}>
            <TokenIcon tokenKey={defaultYieldAssetKey} fontSize="20px" />
            <Text variant="smallParagraph" color="text">
              {defaultYieldAssetName}
            </Text>
          </Flex>
          <Text variant="smallParagraph" color="text">
            {defaultYieldAssetPercent}
          </Text>
        </Flex>
      </Flex>

      <Divider />

      {/* Token Incentives */}
      <Flex direction="column">
        <Flex align="center" gap={2}>
          <Text variant="smallParagraph" color="tooltipLabel">
            Token Incentives
          </Text>
          <IonTooltip label="APYs are calculated as (APY = Annualized Incentives Value / Current TVL)">
            <InfoOutlineIcon fontSize="12px" color="infoIcon" />
          </IonTooltip>
        </Flex>
        {tokenIncentives.map((tokenIncentive) => (
          <Flex key={tokenIncentive.tokenKey} align="center" justify="space-between" mt={1}>
            <Flex gap={2}>
              <TokenIcon tokenKey={tokenIncentive.tokenKey} fontSize="20px" />
              {tokenIncentive.etherscanUrl ? (
                <Link
                  href={tokenIncentive.etherscanUrl}
                  isExternal
                  style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  <Text variant="smallParagraph" color="text">
                    {tokenIncentive.name}
                  </Text>
                </Link>
              ) : (
                <Text variant="smallParagraph" color="text">
                  {tokenIncentive.name}
                </Text>
              )}
            </Flex>
            <Text variant="smallParagraph" color="text">
              {tokenIncentive.formattedApy}
            </Text>
          </Flex>
        ))}
      </Flex>

      <Divider />

      {/* Rewards */}
      <Flex direction="column">
        <Text variant="smallParagraph" color="tooltipLabel">
          Rewards
        </Text>
        {rewards.map((reward) => (
          <Flex key={reward.key} align="center" justify="space-between" mt={1}>
            <Flex gap={2}>
              <PointSystemIcon pointSystemKey={reward.key} fontSize="20px" />
              <Text variant="smallParagraph" color="text">
                {reward.name}
              </Text>
            </Flex>
            <Text variant="smallParagraph" color="text">
              {reward.pointsMultiplier}X
            </Text>
          </Flex>
        ))}
      </Flex>

      <Divider />

      {/* Net Apy */}
      <IonTooltip
        label={shouldShowMessageForLargeNetApy ? `${fullFormattedNetApy} will likely decrease...` : undefined}
      >
        <Flex justify="space-between">
          <Text variant="smallParagraphBold" color="text">
            Net APY
          </Text>
          <Text variant="smallParagraphBold" color="text">
            {netApy}
          </Text>
        </Flex>
      </IonTooltip>
    </Flex>
  )
}

export default RewardsTooltipContentConnector.Connector(RewardsTooltipContent)
