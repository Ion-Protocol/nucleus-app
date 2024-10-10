import { TokenKey } from './TokenKey'

export interface RewardsTableData {
  tokenKey: TokenKey
  tokenSymbol: string
  claimedTokenAmount: string
  claimedInUsd: string
  claimableTokenAmount: string
  claimableInUsd: string
}
