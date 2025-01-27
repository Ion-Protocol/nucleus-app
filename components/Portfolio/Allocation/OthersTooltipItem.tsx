import { useAppSelector } from '@/store/hooks'
import { AllocationFilter } from '@/store/slices/portfolio'
import { selectAllocationFilter } from '@/store/slices/portfolio/selectors'
import { Flex, Text } from '@chakra-ui/react'
import { tokensConfig } from '@/config/tokens'
import { chainsConfig } from '@/config/chains'
import { TokenKey } from '@/types/TokenKey'
import { ChainKey } from '@/types/ChainKey'
import { chainIconMap } from '@/components/config/chainIcons'
import { tokenIconMap } from '@/components/config/tokenIcons'
import React from 'react'
import { AllocationDetail } from './AllocationTooltip'

interface OthersTooltipItemProps {
  detail: AllocationDetail
}

export function OthersTooltipItem({ detail }: OthersTooltipItemProps) {
  const allocationFilter = useAppSelector(selectAllocationFilter)

  const tokenKey = detail.asset as TokenKey
  const chainKey = detail.network as ChainKey
  const token = tokensConfig[tokenKey]
  const chain = chainsConfig[chainKey]

  const name = allocationFilter === AllocationFilter.AssetType ? token?.name : chain?.name

  let icon = null
  if (allocationFilter === AllocationFilter.Network) {
    icon = chainIconMap[chainKey]
  } else if (allocationFilter === AllocationFilter.AssetType) {
    icon = tokenIconMap[tokenKey]
  }

  return (
    <Flex direction="row" justify="space-between" w="200px">
      <Flex>
        <Flex mb={2} mr={2} align="center">
          {icon && React.createElement(icon, { fontSize: 24 })}
        </Flex>
        <Text variant="body-14" color="element.subdued">
          {name}
        </Text>
      </Flex>
      <Text variant="body-14" color="element.subdued">
        {detail.percentageAllocation.toFixed(1)}%
      </Text>
    </Flex>
  )
}
