import { AtomTag } from '@/components/shared/AtomTag'
import { AssetDataItem } from '@/store/slices/portfolio/selectors'
import { Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'

interface EarningsApyCellProps {
  info: CellContext<AssetDataItem, number>
}

export function EarningsApyCell({ info }: EarningsApyCellProps) {
  const { earningsApy, rewardCount } = info.row.original
  return (
    <Flex align="center" gap={2}>
      <Text variant="body-16" color="element.main">
        {earningsApy.toFixed(2)}%
      </Text>
      <AtomTag>{rewardCount} Rewards</AtomTag>
    </Flex>
  )
}
