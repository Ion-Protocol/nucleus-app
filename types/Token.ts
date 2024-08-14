import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'

export interface Token {
  key: TokenKey
  name: string
  symbol: string
  chains: Partial<
    Record<
      BridgeKey,
      {
        address: `0x${string}`
        chainId: number
      }
    >
  >
}
