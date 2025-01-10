import { RootState } from '@/store'
import { abbreviateNumber, smartRoundDown } from '@/utils/number'
import { formatEther, formatUnits, parseEther } from 'viem'
import { selectUsdPerEthRate } from '../price'
import { mockGraphData } from './mockGraphData'
import { createSelector } from '@reduxjs/toolkit'
import { AllocationFilter } from './slice'
import { mockAssetData } from './mock-data/mockAssetData3'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { mockTransactionData } from './mockTransactionData'
import { tokensConfig } from '@/config/tokens'
import { chainsConfig } from '@/config/chains'
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '@/utils/string'

// TODO: Remove this, just for testing
const allLoading = false

function mapNetworkNameToChainKey(networkName: string): ChainKey {
  const map = {
    Sei: ChainKey.SEI,
    Form: ChainKey.FORM,
    Rari: ChainKey.RARI,
    Swell: ChainKey.SWELL,
    Dinero: ChainKey.DINERO,
    Eclipse: ChainKey.ECLIPSE,
    Ethereum: ChainKey.ETHEREUM,
    UniFi: ChainKey.UNIFI,
  }
  return map[networkName as keyof typeof map]
}

function mapTokenToTokenKey(token: string): TokenKey {
  const map = {
    ssETH: TokenKey.SSETH,
    WETH: TokenKey.WETH,
    FETH: TokenKey.FETH,
    rariETH: TokenKey.RARIETH,
    pzETH: TokenKey.PZETH,
    wstETH: TokenKey.WSTETH,
    RSWETH: TokenKey.RSWETH,
    SSETH: TokenKey.SSETH,
    TETH: TokenKey.TETH,
    UNIFIETH: TokenKey.UNIFIETH,
    DINERO: TokenKey.DINERO,
    WBTC: TokenKey.WBTC,
    SWBTC: TokenKey.SWBTC,
    SEI: TokenKey.SEI,
    SFRXETH: TokenKey.SFRXETH,
    RSETH: TokenKey.RSETH,
  }
  return map[token as keyof typeof map]
}

export interface PerformanceTableData {
  value: string
  date: number
  ethPrice: string
}

export interface PerformanceTableDataWithUsdValue extends PerformanceTableData {
  usdValue: number
}

export interface AssetDataItem {
  asset: TokenKey
  network: ChainKey
  earningsApy: number
  amount: number
  usdValue: number
  rewardCount: number
  allocation: number
}

interface AllocationDataItem extends AssetDataItem {
  percentageAllocation: number
  id: string
}

export enum TransactionType {
  Withdraw = 'withdraw',
  Deposit = 'deposit',
}

export enum TransactionStatus {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Cancelled = 'cancelled',
}

export interface TransactionDataItem {
  id: number
  status: 'pending' | 'fulfilled' | 'cancelled'
  type: 'withdraw' | 'deposit'
  activity: {
    source: {
      token: string
      chain: string
    }
    destination: {
      token: string
      chain: string
    }
  }
  date: number

  // More meta data for the modal
  sourceAmount: string
  destinationAmount: string
  minimumPrice: number
  receiveAtLeast: number
  deadline: number // the date as unix timestamp in ms
  createdAt: number // the date as unix timestamp in ms
  filledPrice: number
  filledAt: number // the date as unix timestamp in ms
}

export interface TransactionFormattedTableDataItem {
  status: string
  type: string
  sourceToken: string
  destinationToken: string
  sourceChain: string
  destinationChain: string
  sourceAmount: string
  destinationAmount: string
  date: string
}

export interface TransactionTableDataItem extends TransactionDataItem {
  table: TransactionFormattedTableDataItem
}

/////////////////////////////////////////////////////////////////////
// Root Portfolio State
/////////////////////////////////////////////////////////////////////
export const selectTimeRange = (state: RootState) => state.portfolio.timeRange

/////////////////////////////////////////////////////////////////////
// User TVL
/////////////////////////////////////////////////////////////////////
export const selectUserTvlInEth = (state: RootState): bigint => {
  // Using a hardcoded value for now
  return parseEther('5.03')
}
export const selectTvlLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}
export const selectUserTvlInUsd = (state: RootState): number => {
  const usdPerEthRate = selectUsdPerEthRate(state)
  const userTvlInEth = selectUserTvlInEth(state)
  const userTvlInUsd = (userTvlInEth * usdPerEthRate) / BigInt(1e8)
  return parseFloat(formatEther(userTvlInUsd))
}
export const selectFormattedUserTvl = (state: RootState): string => {
  const userTvlInUsd = selectUserTvlInUsd(state)
  return abbreviateNumber(userTvlInUsd, { decimals: 2 })
}

/////////////////////////////////////////////////////////////////////
// Performance
/////////////////////////////////////////////////////////////////////
export const selectMonthlyPerformancePercentage = (state: RootState): number => {
  // Using a hardcoded value for now
  return 18.23
}
export const selectMonthlyPerformancePercentageLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}
export const selectFormattedMonthlyPerformancePercentage = (state: RootState): string => {
  const monthlyPerformancePercentage = selectMonthlyPerformancePercentage(state)
  return `${monthlyPerformancePercentage.toFixed(2)}%`
}

/////////////////////////////////////////////////////////////////////
// Avg Monthly APY
/////////////////////////////////////////////////////////////////////
export const selectAvgMonthlyApy = (state: RootState): number => {
  // Using a hardcoded value for now
  return 17.23
}
export const selectAvgMonthlyApyLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}
export const selectFormattedAvgMonthlyApy = (state: RootState): string => {
  const avgMonthlyApy = selectAvgMonthlyApy(state)
  return `${avgMonthlyApy.toFixed(2)}%`
}
export const selectMonthlyApyValueInEth = (state: RootState): bigint => {
  // Using a hardcoded value for now
  return parseEther('0.12')
}
export const selectMonthlyApyValueInUsd = (state: RootState): number => {
  const usdPerEthRate = selectUsdPerEthRate(state)
  const monthlyApyValueInEth = selectMonthlyApyValueInEth(state)
  const monthlyApyValueInUsd = (monthlyApyValueInEth * usdPerEthRate) / BigInt(1e8)
  return parseFloat(formatEther(monthlyApyValueInUsd))
}
export const selectFormattedMonthlyApyValueInUsd = (state: RootState): string => {
  const monthlyApyValueInUsd = selectMonthlyApyValueInUsd(state)
  return abbreviateNumber(monthlyApyValueInUsd, { decimals: 2 })
}
export const selectRewardsCount = (state: RootState): number => {
  // Using a hardcoded value for now
  return 7
}

/////////////////////////////////////////////////////////////////////
// Total Earned
/////////////////////////////////////////////////////////////////////
export const selectTotalEarnedInEth = (state: RootState): bigint => {
  // Using a hardcoded value for now
  return parseEther('0.34')
}
export const selectTotalEarnedLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}
export const selectTotalEarnedInUsd = (state: RootState): number => {
  const usdPerEthRate = selectUsdPerEthRate(state)
  const totalEarnedInEth = selectTotalEarnedInEth(state)
  const totalEarnedInUsd = (totalEarnedInEth * usdPerEthRate) / BigInt(1e8)
  return parseFloat(formatEther(totalEarnedInUsd))
}
export const selectFormattedTotalEarned = (state: RootState): string => {
  const totalEarnedInUsd = selectTotalEarnedInUsd(state)
  return abbreviateNumber(totalEarnedInUsd, { decimals: 2 })
}
export const selectStartOfPosition = (state: RootState): number => {
  // Using a hardcoded value for now
  return 1707297297000 // Feb 7, 2024 in ms
}
export const selectFormattedStartOfPosition = (state: RootState): string => {
  const startOfPosition = selectStartOfPosition(state)
  const date = new Date(startOfPosition)
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

/////////////////////////////////////////////////////////////////////
// Applications Used
/////////////////////////////////////////////////////////////////////
export const selectApplicationsUsedCount = (state: RootState): number => {
  // Using a hardcoded value for now
  return 4
}

export const selectTotalApplicationCount = (state: RootState): number => {
  // Using a hardcoded value for now
  return 8
}
export const selectTotalApplicationCountLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}

/////////////////////////////////////////////////////////////////////
// Performance Graph Data
/////////////////////////////////////////////////////////////////////
export const selectPerformanceGraphData = (state: RootState): PerformanceTableData[] => {
  // Using a hardcoded value for now
  return mockGraphData as PerformanceTableData[]
}
export const selectPerformanceGraphDataLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}

// SHOULD memoize: Returns a new array
export const selectPerformanceGraphDataInUsd = createSelector(
  [selectPerformanceGraphData],
  (tableData): PerformanceTableDataWithUsdValue[] => {
    return tableData.map((row) => {
      const usdValueAsBigInt = (BigInt(row.value) * BigInt(row.ethPrice)) / BigInt(1e8)
      const usdValue = parseFloat(formatEther(usdValueAsBigInt))
      return {
        ...row,
        usdValue,
      }
    })
  }
)

/////////////////////////////////////////////////////////////////////
// Allocation
/////////////////////////////////////////////////////////////////////
export const selectAllocationFilter = (state: RootState): AllocationFilter => {
  return state.portfolio.allocationFilter
}

export const selectAssetData = createSelector([(state: RootState) => state], () => {
  const totalValue = mockAssetData.reduce((sum, item) => sum + item.usdValue, 0)
  return mockAssetData.map((a) => {
    return {
      ...a,
      asset: mapTokenToTokenKey(a.asset),
      network: mapNetworkNameToChainKey(a.network),
      size: a.usdValue,
      allocation: (a.usdValue / totalValue) * 100,
    }
  }) as AssetDataItem[]
})

export const selectAssetDataLoading = createSelector([selectAssetData], (assetData) => {
  // Using a hardcoded value for now
  return allLoading
})

export const selectAllocationDataByAssetType = createSelector([selectAssetData], (assetData) => {
  const allocationMap = new Map<string, any>()

  assetData.forEach(({ asset, usdValue, ...rest }) => {
    if (allocationMap.has(asset)) {
      const existing = allocationMap.get(asset)
      allocationMap.set(asset, {
        ...existing,
        usdValue: existing.usdValue + usdValue, // Sum the values
      })
    } else {
      allocationMap.set(asset, {
        asset,
        usdValue: usdValue,
        ...rest, // Include all other props
      })
    }
  })

  const totalValue = Array.from(allocationMap.values()).reduce((sum, item) => sum + item.usdValue, 0)

  return Array.from(allocationMap.values()).map((item) => ({
    ...item,
    percentageAllocation: (item.usdValue / totalValue) * 100, // Calculate percentage allocation
    size: item.usdValue,
  }))
})

export const selectAllocationDataByNetwork = createSelector([selectAssetData], (assetData) => {
  const allocationMap = new Map<string, any>()

  assetData.forEach(({ network, usdValue, ...rest }) => {
    if (allocationMap.has(network)) {
      const existing = allocationMap.get(network)
      allocationMap.set(network, {
        ...existing,
        usdValue: existing.usdValue + usdValue, // Sum the values
      })
    } else {
      allocationMap.set(network, {
        network,
        usdValue: usdValue,
        ...rest, // Include all other props
      })
    }
  })

  const totalValue = Array.from(allocationMap.values()).reduce((sum, item) => sum + item.usdValue, 0)

  return Array.from(allocationMap.values()).map((item) => ({
    ...item,
    percentageAllocation: (item.usdValue / totalValue) * 100, // Calculate percentage allocation
    size: item.usdValue,
  }))
})

export const selectAllocationData = createSelector(
  [selectAllocationDataByAssetType, selectAllocationDataByNetwork, selectAllocationFilter],
  (allocationDataByAssetType, allocationDataByNetwork, allocationFilter) => {
    // 1) Select data based on the filter.
    let allocationData: any[] = []
    if (allocationFilter === AllocationFilter.AssetType) {
      allocationData = allocationDataByAssetType
    } else if (allocationFilter === AllocationFilter.Network) {
      allocationData = allocationDataByNetwork
    }

    if (!allocationData.length) return []

    // 2) Sort in descending order by usdValue.
    const sortedData = [...allocationData].sort((a, b) => b.usdValue - a.usdValue)
    const totalValue = sortedData.reduce((sum, item) => sum + item.usdValue, 0)

    // 3) Split out items >= 10% from items < 10%.
    const largeItems = sortedData.filter((item) => (item.usdValue / totalValue) * 100 >= 10)
    const smallItems = sortedData.filter((item) => (item.usdValue / totalValue) * 100 < 10)

    // 4) Sum up the small items for “other”.
    const smallItemsValue = smallItems.reduce((sum, item) => sum + item.usdValue, 0)
    const smallItemsPercent = (smallItemsValue / totalValue) * 100

    // 5) Build an “other” item if needed.
    let otherItem = null
    if (smallItemsValue > 0) {
      otherItem = {
        // Real values
        asset: 'other',
        network: 'various',
        usdValue: smallItemsValue,
        percentageAllocation: smallItemsPercent,

        // Force the Treemap to render at least 10% area
        size: Math.max(smallItemsValue, 0.1 * totalValue),

        // Keep track of the details
        details: smallItems.map((item) => ({
          asset: item.asset,
          network: item.network,
          percentageAllocation: item.percentageAllocation,
        })),
      }
    }

    // 6) Combine largeItems with the “other” item, if any.
    let combinedItems = largeItems
    if (otherItem) {
      combinedItems = [...largeItems, otherItem]
    }

    // 7) If we still end up with more than 4 items, merge everything after the top 3 into a second “other” item.
    if (combinedItems.length > 4) {
      const topThree = combinedItems.slice(0, 3)
      const rest = combinedItems.slice(3)

      const restValue = rest.reduce((sum, item) => sum + item.usdValue, 0)
      const restPercentage = (restValue / totalValue) * 100

      // Create a second “other” for the overflow items.
      const secondOtherItem = {
        // Real values
        asset: 'other',
        network: 'various',
        usdValue: restValue,
        percentageAllocation: restPercentage,

        // Force at least 15% area
        size: Math.max(restValue, 0.15 * totalValue),

        // Keep track of the details
        details: rest.map((item) => ({
          asset: item.asset,
          network: item.network,
          percentageAllocation: item.percentageAllocation,
        })),
      }

      combinedItems = [...topThree, secondOtherItem]
    }

    return combinedItems
  }
)

export const selectFormattedAllocationData = createSelector([selectAllocationData], (allocationData) => {
  return allocationData.map((item) => ({
    ...item,
    percentageAllocation: parseFloat(item.percentageAllocation.toFixed(2)), // Ensure percentage is properly formatted
  }))
})

/////////////////////////////////////////////////////////////////////
// Transaction History
/////////////////////////////////////////////////////////////////////
export const selectTransactionData = (state: RootState): TransactionDataItem[] => {
  return mockTransactionData
}

export const selectTransactionDataLoading = (state: RootState): boolean => {
  // Using a hardcoded value for now
  return allLoading
}

export const selectTransactionTableData = createSelector(
  [selectTransactionData],
  (transactionData): TransactionTableDataItem[] => {
    return transactionData.map((item) => {
      const sourceToken = tokensConfig[item.activity.source.token as TokenKey].name
      const destinationToken = tokensConfig[item.activity.destination.token as TokenKey].name
      const sourceChain = chainsConfig[item.activity.source.chain as ChainKey].name
      const destinationChain = chainsConfig[item.activity.destination.chain as ChainKey].name
      const formattedDate = format(new Date(item.date), 'dd MMM yyyy HH:mm:ss')
      const formattedStatus = capitalizeFirstLetter(item.status)
      const formattedType = capitalizeFirstLetter(item.type)
      const formattedSourceAmount = smartRoundDown(formatUnits(BigInt(item.sourceAmount), 18))
      const formattedDestinationAmount = smartRoundDown(formatUnits(BigInt(item.destinationAmount), 18))

      return {
        ...item,
        table: {
          status: formattedStatus,
          type: formattedType,
          sourceToken,
          destinationToken,
          sourceChain,
          destinationChain,
          date: formattedDate,
          sourceAmount: formattedSourceAmount,
          destinationAmount: formattedDestinationAmount,
        },
      }
    })
  }
)
