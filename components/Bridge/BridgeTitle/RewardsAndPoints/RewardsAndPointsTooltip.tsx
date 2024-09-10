import { ChainIcon } from '@/components/config/chainIcons'
import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { ChainKey } from '@/types/ChainKey'
import { PointSystemKey } from '@/types/PointSystem'
import { Flex, Text, Grid } from '@chakra-ui/react'
import React from 'react'

export interface RewardsAndPointsRow {
  rewards: { chainKey: ChainKey; rewardPercentage: number } | null
  points: { pointSystemKey: PointSystemKey; multiplier: number } | null
}

interface RewardsAndTooltipsProps {
  rows: RewardsAndPointsRow[]
}

export function RewardsAndPointsTooltip({ rows }: RewardsAndTooltipsProps) {
  return (
    <Flex py={2} px={6}>
      <Grid templateColumns="repeat(2, 1fr)" gap={0} alignItems="stretch">
        <Flex borderRight="1px solid" borderColor="border">
          <Text variant="smallParagraph" color="textSecondary" py={2} mr={5}>
            Rewards
          </Text>
        </Flex>
        <Flex>
          <Text variant="smallParagraph" color="textSecondary" py={2} ml={5}>
            Points
          </Text>
        </Flex>
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            <Flex borderRight="1px solid" borderColor="border">
              {row.rewards && (
                <Flex align="center" gap={2} py={2} mr={5}>
                  <ChainIcon fontSize="20px" chainKey={row.rewards.chainKey} />
                  <Text variant="paragraph" color="text">
                    {row.rewards.rewardPercentage}%
                  </Text>
                </Flex>
              )}
            </Flex>
            <Flex>
              {row.points && (
                <Flex align="center" gap={2} py={2} ml={5}>
                  <PointSystemIcon fontSize="20px" pointSystemKey={row.points.pointSystemKey} />
                  <Text variant="paragraph" color="text">
                    {row.points.multiplier}x
                  </Text>
                </Flex>
              )}
            </Flex>
          </React.Fragment>
        ))}
      </Grid>
    </Flex>
  )
}
