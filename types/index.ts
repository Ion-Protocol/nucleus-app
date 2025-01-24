import { ChainKey } from './ChainKey'
import { TokenKey } from './TokenKey'

export interface DashboardTableDataItem {
  asset: TokenKey
  chain: ChainKey | undefined
  tvl: {
    formatted: string | undefined
    value: number | undefined
  }
  apy: string | undefined
  applications: ChainKey[]
}
