import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'

export interface Token {
  key: TokenKey
  name: string
  symbol: string
  chains: Partial<
    Record<
      ChainKey,
      {
        address: `0x${string}`
        chainId: number
      }
    >
  >
}
