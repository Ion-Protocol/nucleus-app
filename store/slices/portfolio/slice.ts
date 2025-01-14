import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum TimeRange {
  OneMonth = '1M',
  ThreeMonths = '3M',
  OneYear = '1Y',
}

export enum PortfolioTabOption {
  Overview = 'overview',
  TransactionHistory = 'transaction-history',
}

export enum AllocationFilter {
  AssetType = 'Asset Type',
  Network = 'by Network',
}

export enum TableColumn {
  Asset = 'asset',
  EarningsApy = 'earnings-apy',
  Allocation = 'allocation',
  Amount = 'amount',
  Value = 'value',
}

// ==================
// 1. STATE INTERFACE
// ==================
interface PortfolioSlice {
  timeRange: TimeRange
  allocationFilter: AllocationFilter
  sortTableBy: TableColumn
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: PortfolioSlice = {
  timeRange: TimeRange.OneMonth,
  allocationFilter: AllocationFilter.AssetType,
  sortTableBy: TableColumn.Asset,
}

// ==================
// 3. REDUCERS
// ==================
export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload
    },
    setAllocationFilter: (state, action: PayloadAction<AllocationFilter>) => {
      state.allocationFilter = action.payload
    },
    setSortTableBy: (state, action: PayloadAction<TableColumn>) => {
      state.sortTableBy = action.payload
    },
  },
})

// ==================
// 4. HELPFUL EXPORTS
// ==================
export const { setTimeRange, setAllocationFilter, setSortTableBy } = portfolioSlice.actions
export const portfolioReducer = portfolioSlice.reducer
