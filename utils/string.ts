export const truncateTxHash = (txHash: string | null): string | null => {
  return txHash ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : null
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
