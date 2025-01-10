import { AssetDataItem } from '@/store/slices/portfolio/selectors'
import { abbreviateNumber } from '@/utils/number'
import { Skeleton, Text } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { ActionCell } from './ActionCell'
import { AssetCell } from './AssetCell'
import { EarningsApyCell } from './EarningsApyCell'

const columnHelper = createColumnHelper<AssetDataItem>()

export function createAssetColumns(
  handleMintMore: (dataItem: AssetDataItem) => void,
  handleWithdraw: (dataItem: AssetDataItem) => void,
  isLoading?: boolean
) {
  return [
    columnHelper.accessor('asset', {
      header: 'Asset',
      cell: (info) => <AssetCell info={info} isLoading={isLoading} />,
    }),
    columnHelper.accessor('earningsApy', {
      header: 'Earnings APY',
      cell: (info) =>
        !isLoading ? (
          <EarningsApyCell info={info} />
        ) : (
          <Skeleton
            w="140px"
            h="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        ),
    }),
    columnHelper.accessor('allocation', {
      header: 'Allocation',
      cell: (info) =>
        !isLoading ? (
          <Text variant="body-16" color="element.main">
            {info.getValue().toFixed(1)}%
          </Text>
        ) : (
          <Skeleton
            w="140px"
            h="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) =>
        !isLoading ? (
          <Text variant="body-16" color="element.main">
            {info.getValue().toFixed(3)}
          </Text>
        ) : (
          <Skeleton
            w="140px"
            h="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        ),
    }),
    columnHelper.accessor('usdValue', {
      header: 'Value',
      cell: (info) =>
        !isLoading ? (
          <Text variant="body-16" color="element.main">
            {abbreviateNumber(info.getValue())}
          </Text>
        ) : (
          <Skeleton
            w="140px"
            h="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        !isLoading ? (
          <ActionCell handleMintMore={handleMintMore} handleWithdraw={handleWithdraw} row={row} />
        ) : (
          <Skeleton
            w="60px"
            h="14px"
            startColor="element.invert.secondary"
            endColor="element.invert.primary"
            borderRadius="8px"
          />
        ),
    }),
  ]
}
