import { Allocation } from '@/components/Portfolio/Allocation'
import { AssetsTable } from '@/components/Portfolio/AssetsTable'
import { AssetTooltip } from '@/components/Portfolio/AssetsTable/AssetTooltip'
import { PerformanceGraph } from '@/components/Portfolio/PerformanceGraph'
import { PortfolioTab } from '@/components/Portfolio/PortfolioTab'
import { TransactionTable } from '@/components/Portfolio/TransactionTable'
import { AtomTag } from '@/components/shared/AtomTag'
import { ClockRewindIcon } from '@/components/shared/icons/ClockRewind'
import { PieChartIcon } from '@/components/shared/icons/PieChart'
import { PortfolioSummaryItem } from '@/components/shared/PortfolioSummaryItem'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTimeRange, TimeRange } from '@/store/slices/portfolio'
import {
  selectApplicationsUsedCount,
  selectAvgMonthlyApyLoading,
  selectFormattedAvgMonthlyApy,
  selectFormattedMonthlyApyValueInUsd,
  selectFormattedMonthlyPerformancePercentage,
  selectFormattedStartOfPosition,
  selectFormattedTotalEarned,
  selectFormattedUserTvl,
  selectPerformanceGraphDataLoading,
  selectRewardsCount,
  selectTimeRange,
  selectTotalApplicationCount,
  selectTotalApplicationCountLoading,
  selectTotalEarnedLoading,
  selectTvlLoading,
} from '@/store/slices/portfolio/selectors'
import { Flex, TabList, TabPanel, TabPanels, Tabs, Text, useColorMode, useTheme } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Portfolio() {
  const dispatch = useAppDispatch()
  const { colorMode } = useColorMode()

  // State
  const [selectedTab, setSelectedTab] = useState<number>(0)

  // Selectors
  const formattedUserTvl = useAppSelector(selectFormattedUserTvl)
  const formattedMonthlyPerformancePercentage = useAppSelector(selectFormattedMonthlyPerformancePercentage)
  const formattedAvgMonthlyApy = useAppSelector(selectFormattedAvgMonthlyApy)
  const formattedMonthlyApyValueInUsd = useAppSelector(selectFormattedMonthlyApyValueInUsd)
  const formattedTotalEarned = useAppSelector(selectFormattedTotalEarned)
  const formattedStartOfPosition = useAppSelector(selectFormattedStartOfPosition)
  const applicationsUsed = useAppSelector(selectApplicationsUsedCount)
  const totalApplications = useAppSelector(selectTotalApplicationCount)
  const rewardsCount = useAppSelector(selectRewardsCount)
  const selectedTimeRange = useAppSelector(selectTimeRange)

  const tvlLoading = useAppSelector(selectTvlLoading)
  const avgMonthlyApyLoading = useAppSelector(selectAvgMonthlyApyLoading)
  const totalEarnedLoading = useAppSelector(selectTotalEarnedLoading)
  const applicationsUsedLoading = useAppSelector(selectTotalApplicationCountLoading)
  const performanceGraphDataLoading = useAppSelector(selectPerformanceGraphDataLoading)

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex)
  }

  const handleTimeRangeChange = (timeRange: TimeRange) => {
    dispatch(setTimeRange(timeRange))
  }

  /////////////////////////////////////////////////////////
  // TODO: REMOVE THIS WHEN PORTFOLIO IS FULLY IMPLEMENTED!
  /////////////////////////////////////////////////////////
  // This redirect only exits to prevent a user from visiting the portfolio page
  // by typing the URL into the browser.
  if (typeof window !== 'undefined' && window.location.pathname === '/portfolio') {
    window.location.href = '/'
    return null
  }

  return (
    <Flex px={9} py={9} direction="column" gap={6} bg={colorMode === 'dark' ? '#1C1A17' : '#FFFDFA'}>
      <Text variant="h3">Portfolio</Text>
      {/* Top Summary Row */}
      <Flex>
        <PortfolioSummaryItem
          title="Total Value"
          body={formattedUserTvl}
          subtext={`+${formattedMonthlyPerformancePercentage} last month`}
          subtextColor="tag.info.live.element"
          isLoading={tvlLoading}
        />
        <PortfolioSummaryItem
          title="Avg. Monthly APY"
          body={formattedAvgMonthlyApy}
          subtext={`~${formattedMonthlyApyValueInUsd}`}
          sideTag={<AtomTag tooltip={<AssetTooltip />}>+{rewardsCount} Rewards</AtomTag>}
          isLoading={avgMonthlyApyLoading}
        />
        <PortfolioSummaryItem
          title="Total Earned"
          body={formattedTotalEarned}
          subtext={`Since ${formattedStartOfPosition}`}
          isLoading={totalEarnedLoading}
        />
        <PortfolioSummaryItem
          title="Applications Used"
          body={`${applicationsUsed} applications`}
          subtext={totalApplications > 1 ? `Across ${totalApplications} networks` : ''}
          isLoading={applicationsUsedLoading}
        />
      </Flex>
      <Flex mt={6}>
        <Tabs variant="unstyled" w="full" index={selectedTab} onChange={(index) => handleTabChange(index)}>
          <TabList>
            <PortfolioTab isSelected={selectedTab === 0} onClick={() => handleTabChange(0)} icon={<PieChartIcon />}>
              Overview
            </PortfolioTab>
            <PortfolioTab isSelected={selectedTab === 1} onClick={() => handleTabChange(1)} icon={<ClockRewindIcon />}>
              Transaction History
            </PortfolioTab>
          </TabList>
          <TabPanels mt={6}>
            <TabPanel p={0}>
              <Flex gap={6}>
                <Flex w="50%">
                  {/* Ensure the PerformanceGraph only loads when the Overview tab is selected.
                    This prevents Recharts from attempting to render with dimensions of 0, which would cause an error. */}
                  {selectedTab === 0 && (
                    <PerformanceGraph selectedTimeRange={selectedTimeRange} onTimeRangeChange={handleTimeRangeChange} />
                  )}
                </Flex>
                <Flex w="50%">{selectedTab === 0 && <Allocation />}</Flex>
              </Flex>
              <Flex mt={6}>
                <AssetsTable />
              </Flex>
            </TabPanel>
            <TabPanel p={0}>
              <TransactionTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  )
}
