export function capitalizeFirstLetter(word: string): string {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const truncateTxHash = (txHash: string | null): string | null => {
  return txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : null
}
