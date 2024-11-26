export type SerializedError = {
  name: string
  message: string
  stack?: string
  code?: number
  shortMessage?: string
  // For transaction-related errors
  data?: {
    code?: number
    message?: string
    data?: unknown
  }
  // For contract interaction errors
  method?: string
  transaction?: {
    from: string
    to?: string
    data: string
    value?: bigint
    gas?: bigint
  }
  // Additional wagmi/viem specific fields
  details?: string
  metaMessages?: string[]
  args?: unknown[]
}
