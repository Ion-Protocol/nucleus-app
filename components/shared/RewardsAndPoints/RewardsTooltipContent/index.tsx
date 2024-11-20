import { Address } from 'viem'
import { Divider, Flex, Link, Text } from '@chakra-ui/react'
import { InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons'

import { useGetDefaultYieldAPYQuery } from '@/store/api/nucleusBackendApi'
import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { TokenIcon } from '@/components/config/tokenIcons'
import { IonTooltip } from '@/components/shared/IonTooltip'
import { RewardsTooltipContentConnector } from './connector'
import { useGetRewardsAPYQuery } from '@/store/api/incentivesApi'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'

export function RewardsTooltipContent({
  defaultYieldAssetKey,
  defaultYieldAssetName,
  boringVaultAddress,
  tokenIncentives,
  rewards,
  shouldShowMessageForLargeNetApy,
  tokenKey,
}: RewardsTooltipContentConnector.Props) {
  const { data: rewardsResponse } = useGetRewardsAPYQuery(
    { vaultAddress: boringVaultAddress as Address },
    { skip: !boringVaultAddress || tokenKey !== TokenKey.SSETH }
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
      <Flex align="center" gap={2}>
        <InfoIcon color="text" fontSize="12px" />
        <Text variant="smallParagraph" color="text">
          This vault earns additional incentives
        </Text>
      </Flex>

      {/* Default Yield */}
      <Flex direction="column">
        <Flex align="center" gap={2}>
          <Text variant="smallParagraph" color="textSecondary">
            Default Yield
          </Text>
          <IonTooltip label="Default yield is calculated by annualizing the increase in the token redemption value over a 7 day period.">
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
            {vaultAssetApy ? numberToPercent(vaultAssetApy, 2) : '&rbrace;'}
          </Text>
        </Flex>
      </Flex>

      {/* Token Incentives */}
      {processedTokenIncentives.length > 0 && (
        <>
          <Divider borderColor="borderLight" />

          <Flex direction="column">
            <Flex align="center" gap={2}>
              <Text variant="smallParagraph" color="textSecondary">
                Token Incentives
              </Text>
              <IonTooltip label="Your rewards are calculated using a daily snapshot, and claims are made available each week until the end of the incentives campaign.APYs are calculated as (APY = Annualized Incentives Value / Current TVL)">
                <InfoOutlineIcon fontSize="12px" color="infoIcon" />
              </IonTooltip>
            </Flex>
            {processedTokenIncentives.map((tokenIncentive) => (
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
        </>
      )}

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
            {numberToPercent(totalApy, 2)}
          </Text>
        </Flex>
      </IonTooltip>
    </Flex>
  )
}

export default RewardsTooltipContentConnector.Connector(RewardsTooltipContent)
