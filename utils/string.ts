export const truncateTxHash = (txHash: string | null): string | null => {
  return txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : null
}
