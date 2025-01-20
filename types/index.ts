import { ChainKey } from './ChainKey'
import { TokenKey } from './TokenKey'

export interface DashboardTableDataItem {
  asset: TokenKey
  chain: ChainKey | undefined
  tvl: string | undefined
  apy: string | undefined
  applications: ChainKey[]
}
