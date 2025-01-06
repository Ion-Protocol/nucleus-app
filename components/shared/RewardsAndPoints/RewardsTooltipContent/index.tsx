import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons'
import { Divider, Flex, Link, Text } from '@chakra-ui/react'
import { Address } from 'viem'

import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { TokenIcon } from '@/components/config/tokenIcons'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { hardcodedApy } from '@/config/constants'
import { useGetRewardsAPYQuery } from '@/store/slices/incentivesApi'
import { useGetDefaultYieldAPYQuery } from '@/store/slices/nucleusBackendApi'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'
import { RewardsTooltipContentConnector } from './connector'

export function RewardsTooltipContent({
  defaultYieldAssetKey,
  defaultYieldAssetName,
  defaultYieldTooltipText,
  boringVaultAddress,
  tokenIncentives,
  rewards,
  shouldShowMessageForLargeNetApy,
  tokenKey,
}: RewardsTooltipContentConnector.Props) {
  // Skipping for now to prevent errors
  // TODO: Figure out why this was only called for SSETH
  const { data: rewardsResponse } = useGetRewardsAPYQuery(
    { vaultAddress: boringVaultAddress as Address },
    { skip: true }
    // { skip: !boringVaultAddress }
  )
  const { data: boringVaultApy } = useGetDefaultYieldAPYQuery({ tokenAddress: boringVaultAddress as Address })
  const vaultAssetApy = boringVaultApy ? boringVaultApy.apy : 0
  const totalApy = tokenKey === TokenKey.SSETH && rewardsResponse ? rewardsResponse?.APY + vaultAssetApy : vaultAssetApy

  /*
   * Process tokenIncentives to include reward APYs
   * This is not a great solution as it is has a lot of logic specific to the SSETH vault
   */
  const processedTokenIncentives = tokenIncentives.map((incentive) => {
    if (incentive.tokenAddress && rewardsResponse?.APYPerToken) {
      const rewardApy = rewardsResponse.APYPerToken[incentive.tokenAddress as Address] || 0
      return {
        ...incentive,
        formattedApy: numberToPercent(rewardApy, 2),
      }
    }
    return incentive
  })

  return (
    <Flex direction="column" p={3} gap={3}>
      {/* Default Yield */}
      <Flex direction="column">
        <Flex align="center" gap={2}>
          <Text variant="smallParagraph" color="textSecondary">
            Default Yield
          </Text>
          <IonTooltip label={defaultYieldTooltipText}>
            <InfoOutlineIcon fontSize="12px" color="infoIcon" />
          </IonTooltip>
        </Flex>
        <Flex align="center" justify="space-between" mt={1}>
          <Flex gap={2}>
            <TokenIcon tokenKey={defaultYieldAssetKey} fontSize="20px" />
            <Text variant="smallParagraph" color="text">
              {defaultYieldAssetName}
            </Text>
          </Flex>
          <Text variant="smallParagraph" color="text">
            {vaultAssetApy ? numberToPercent(vaultAssetApy, 2) : numberToPercent(hardcodedApy, 2)}
          </Text>
        </Flex>
      </Flex>

      <Divider borderColor="borderLight" />

      {/* Rewards */}
      <Flex direction="column" gap={1}>
        <Text variant="smallParagraph" color="textSecondary">
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

      <Divider borderColor="borderLight" />

      {/* Net Apy */}
      <IonTooltip label={shouldShowMessageForLargeNetApy ? `${totalApy} will likely decrease...` : undefined}>
        <Flex justify="space-between">
          <Text variant="smallParagraphBold" color="text">
            Net APY
          </Text>
          <Text variant="smallParagraphBold" color="text">
            {totalApy ? numberToPercent(totalApy, 2) : numberToPercent(hardcodedApy, 2)}
          </Text>
        </Flex>
      </IonTooltip>
    </Flex>
  )
}

export default RewardsTooltipContentConnector.Connector(RewardsTooltipContent)
