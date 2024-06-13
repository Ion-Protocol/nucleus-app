import { TokenKey } from '@/config/token'

export interface Chain {
  name: string
  availableTokens: TokenKey[]
}
