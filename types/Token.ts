import { ChainKey } from '@/config/chains'
import { TokenKey } from '@/config/token'

export interface Token {
  key: TokenKey
  name: string
  symbol: string
  chains: Record<
    ChainKey,
    {
      address: `0x${string}`
      getPrice: () => Promise<bigint>
    }
  >
}
