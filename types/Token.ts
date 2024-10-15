import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Address } from 'viem'

export interface Token {
  key: TokenKey
  name: string
  fullName?: string
  symbol: string
  addresses: Partial<Record<ChainKey, string>>
  rateOracles?: Partial<Record<ChainKey, string>> // For getting the token/usd rate for that token on that chain
}
