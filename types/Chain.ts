import { TokenKey } from '@/config/token'
import { Market, MarketKey } from './Market'

export interface Chain {
  id: number
  name: string
  availableTokens: TokenKey[]
  markets: Record<MarketKey, Market>
  testChain?: boolean
}
