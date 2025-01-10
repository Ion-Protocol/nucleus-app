import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AllocationFilter, setAllocationFilter } from '@/store/slices/portfolio'
import {
  selectAllocationData,
  selectAllocationFilter,
  selectAssetDataLoading,
} from '@/store/slices/portfolio/selectors'
import { Flex, Text } from '@chakra-ui/react'
import { ResponsiveContainer, Treemap } from 'recharts'
import { AllocationBox } from './AllocationBox'
import { FilterMenu } from './FilterMenu'
import { LoadingChart } from './LoadingChart'

export function Allocation() {
  const dispatch = useAppDispatch()
  const allocationFilter = useAppSelector(selectAllocationFilter)
  const allocationData = useAppSelector(selectAllocationData)
  const isLoading = useAppSelector(selectAssetDataLoading)

  function handleFilterChange(filter: AllocationFilter) {
    dispatch(setAllocationFilter(filter))
  }

  return (
    <Flex w="full" direction="column" gap={5}>
      {/* Header */}
      <Flex justify="space-between" align="center" w="full" h="30px">
        <Text variant="body-16-m" color="element.subdued">
          Allocation
        </Text>
        <FilterMenu value={allocationFilter} onChange={handleFilterChange} />
      </Flex>

      {/* Treemap Chart */}
      <Flex w="full" h="360px">
        {!isLoading ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <Treemap
              data={allocationData.map((a) => ({
                ...a,
                name: allocationFilter === AllocationFilter.AssetType ? a.asset : a.network,
              }))}
              dataKey="size"
              content={<AllocationBox />}
              animationDuration={500}
            ></Treemap>
          </ResponsiveContainer>
        ) : (
          <LoadingChart />
        )}
      </Flex>
    </Flex>
  )
}
