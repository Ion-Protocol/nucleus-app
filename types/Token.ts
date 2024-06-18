export interface Token {
  name: string
  symbol: string
  address: `0x${string}`
  getPrice: () => Promise<bigint>
}
