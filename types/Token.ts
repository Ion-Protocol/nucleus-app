import { TokenKey } from '@/config/token'

export interface Token {
  key: TokenKey
  name: string
  symbol: string
  address: `0x${string}`
  getPrice: () => Promise<bigint>
}
